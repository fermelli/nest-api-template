import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(48)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(128)
  email: string;
}
