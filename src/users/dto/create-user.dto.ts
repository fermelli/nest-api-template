import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { RolesDto } from 'src/roles/dto/roles.dto';

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

  @Type(() => RolesDto)
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({
    each: true,
  })
  roles: RolesDto[];
}
