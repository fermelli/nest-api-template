import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ResponseCustom } from 'src/app/interfaces/response-custom.interface';
import { BaseService } from 'src/common/services/base.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { SignInResponse } from './entities/sign-in-response';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up-dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { compareSync, hashSync } from 'bcrypt';

@Injectable()
export class AuthService extends BaseService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  async signUp(signUpDto: SignUpDto): Promise<ResponseCustom<SignInResponse>> {
    signUpDto.password = hashSync(signUpDto.password, 10);

    const { data } = await this.usersService.create(signUpDto);
    const user = data as User;

    return {
      message: 'User created successfully',
      data: await this.getJwtToken(user),
    };
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<ResponseCustom<SignInResponse>> {
    const { data } = await this.usersService.findOneByEmail(email);
    const user = data as User;

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

  private async getJwtToken(jwtPayload: JwtPayload): Promise<SignInResponse> {
    const payload = JSON.parse(JSON.stringify(jwtPayload));
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }
}
