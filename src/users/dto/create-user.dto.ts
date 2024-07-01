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
import { PermissionsDto } from 'src/permissions/dtos/permissions.dto';
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

  @Type(() => PermissionsDto)
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({
    each: true,
  })
  permissions: PermissionsDto[];
}
