import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { Public } from './decorators/public.decorator';
import { SignUpDto } from './dto/sign-up-dto';
import { User } from 'src/users/entities/user.entity';
import { GetUser } from './decorators/get-user.decorator';
import { Permission } from 'src/auth/decorators/permission.decorator';
import { SlugedNamePermission } from 'src/auth/enums/sluged-name-permission.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Public()
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Get('me')
  @Permission(SlugedNamePermission.GET_DATA_ABOUT_ME)
  me(@GetUser() user: User) {
    return this.authService.me(user);
  }
}
