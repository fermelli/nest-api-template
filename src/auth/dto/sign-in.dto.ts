import { PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class SignInDto extends PickType(CreateUserDto, ['email'] as const) {
  @IsNotEmpty()
  @IsString()
  @MaxLength(16)
  password: string;
}
