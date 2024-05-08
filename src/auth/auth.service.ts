import { Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { ResponseCustom } from 'src/app/interfaces/response-custom.interface';
import { BaseService } from 'src/common/services/base.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { TokenAccessResponse } from './interfaces/acces-token-response.interface';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up-dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { compareSync, hashSync } from 'bcrypt';
import { Me } from './entities/me.entity';
import { SignInDto } from './dto/sign-in.dto';

@Injectable({ scope: Scope.REQUEST })
export class AuthService extends BaseService {
  constructor(
    private readonly usersService: UsersService,

    private readonly jwtService: JwtService,
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
      data: await this.getJwtToken(user),
    };
  }

  async signIn(
    signInDto: SignInDto,
  ): Promise<ResponseCustom<TokenAccessResponse>> {
    const { email, password } = signInDto;
    const { data } = await this.usersService.findOneByEmail(email);
    const user = data;

    const isPasswordValid = compareSync(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    delete user.password;
    delete user.deletedAt;

    return {
      message: 'User logged in successfully',
      data: await this.getJwtToken(user),
    };
  }

  private async getJwtToken(
    jwtPayload: JwtPayload,
  ): Promise<TokenAccessResponse> {
    const payload = JSON.parse(JSON.stringify(jwtPayload));
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
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
}
