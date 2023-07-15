import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ResponseCustom } from 'src/app/interfaces/response-custom.interface';
import { BaseService } from 'src/common/services/base.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { SignInResponse } from './entities/sign-in-response';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up-dto';

@Injectable()
export class AuthService extends BaseService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  async signUp(signUpDto: SignUpDto): Promise<ResponseCustom<SignInResponse>> {
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

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = user.comparePassword(password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      message: 'User logged in successfully',
      data: await this.getJwtToken(user),
    };
  }

  private async getJwtToken(user: User): Promise<SignInResponse> {
    const { id, name, email } = user;
    const payload = { id, name, email };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }
}
