import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ResponseCustom } from 'src/app/interfaces/response-custom.interface';
import { BaseService } from 'src/common/services/base.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { TokenAccessResponse } from './interfaces/acces-token-response.interface';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up-dto';
import {
  AccesTokenJwtPayload,
  UserJwtPayload,
  RefreshTokenJwtPayload,
} from './interfaces/jwt-payload.interface';
import { compareSync, hashSync } from 'bcrypt';
import { Me } from './entities/me.entity';
import { SignInDto } from './dto/sign-in.dto';
import { ConfigService } from '@nestjs/config';
import { TokensResponse } from './interfaces/tokens-response.interface';
import { RefreshTokensService } from './refresh-tokens.service';

@Injectable()
export class AuthService extends BaseService {
  constructor(
    private readonly usersService: UsersService,

    private readonly jwtService: JwtService,

    private readonly configService: ConfigService,

    private readonly refreshTokensService: RefreshTokensService,
  ) {
    super();
  }

  async signUp(
    signUpDto: SignUpDto,
  ): Promise<ResponseCustom<TokenAccessResponse>> {
    signUpDto.password = hashSync(signUpDto.password, 10);

    const { data } = await this.usersService.create(signUpDto);
    const user = data;

    delete user.deletedAt;

    return {
      message: 'User created successfully',
      data: await this.generateJwtTokens(user),
    };
  }

  async signIn(signInDto: SignInDto): Promise<ResponseCustom<TokensResponse>> {
    const { email, password } = signInDto;
    const { data } = await this.usersService.findOneByEmail(email);
    const user = data;

    const isPasswordValid = compareSync(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    delete user.password;
    delete user.deletedAt;

    const tokens = await this.generateJwtTokens(user);

    return {
      message: 'User logged in successfully',
      data: tokens,
    };
  }

  private async generateJwtTokens(
    userJwtPayload: UserJwtPayload,
    currentRefreshToken?: string,
  ): Promise<TokensResponse> {
    const accessToken = await this.generateAccessToken(userJwtPayload);
    const refreshToken = await this.generateRefreshToken(
      userJwtPayload.id,
      currentRefreshToken,
    );

    return { accessToken, refreshToken };
  }

  private async generateAccessToken(
    userJwtPayload: UserJwtPayload,
  ): Promise<string> {
    const jwtPayload: AccesTokenJwtPayload = {
      ...userJwtPayload,
      sub: userJwtPayload.id,
      iss: this.configService.get<string>('JWT_ISSUER'),
    };
    const payload = JSON.parse(JSON.stringify(jwtPayload));
    const accessToken = await this.jwtService.signAsync(payload);

    return accessToken;
  }

  private async generateNewRefreshToken(userId: number): Promise<string> {
    try {
      const jwtPayload: RefreshTokenJwtPayload = {
        sub: userId,
        iss: this.configService.get<string>('JWT_ISSUER'),
      };
      const payload = JSON.parse(JSON.stringify(jwtPayload));
      const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
      const expiresIn = this.configService.get<string>(
        'JWT_REFRESH_EXPIRES_IN',
      );
      const newRefreshToken = await this.jwtService.signAsync(payload, {
        secret,
        expiresIn,
      });
      const newRefreshTokenPayload: RefreshTokenJwtPayload =
        this.jwtService.decode(newRefreshToken, {
          json: true,
        }) as RefreshTokenJwtPayload;

      const refreshToken = await this.refreshTokensService.create(
        userId,
        newRefreshToken,
        new Date(newRefreshTokenPayload.exp * 1000),
      );

      return refreshToken.token;
    } catch (error) {
      this.handleErrors(error);
    }
  }

  private async generateRefreshToken(
    userId: number,
    currentRefreshToken?: string,
  ): Promise<string> {
    if (currentRefreshToken) {
      const isRefreshTokenValid = await this.refreshTokensService.isTokenValid(
        currentRefreshToken,
        userId,
      );

      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Refresh token is invalid');
      }

      return currentRefreshToken;
    }

    const newRefreshToken = await this.generateNewRefreshToken(userId);

    return newRefreshToken;
  }

  async me(user: User): Promise<ResponseCustom<Me>> {
    const permissions = (await this.usersService.findAllPermissions(user.id))
      .data;

    return {
      message: 'User profile fetched successfully',
      data: {
        ...user,
        permissions,
      },
    };
  }

  async refreshTokens(
    user: User,
    currentRefreshToken?: string,
  ): Promise<ResponseCustom<TokensResponse>> {
    const userJwtPayload: UserJwtPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    const tokens = await this.generateJwtTokens(
      userJwtPayload,
      currentRefreshToken,
    );

    return {
      message: 'Tokens refreshed successfully',
      data: tokens,
    };
  }
}
