import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Unique } from 'src/common/decorators/unique.decorator';
import { Role } from '../entities/role.entity';
import { PermissionsDto } from 'src/permissions/dtos/permissions.dto';
import { Type } from 'class-transformer';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  @Unique({ entity: Role })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @Type(() => PermissionsDto)
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({
    each: true,
  })
  permissions: PermissionsDto[];
}
