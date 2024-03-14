import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
import { IsSame } from 'src/common/decorators/is-same.decorator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class SignUpDto extends CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  @IsStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minSymbols: 1,
    minNumbers: 1,
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsSame('password')
  passwordConfirmation: string;
}
