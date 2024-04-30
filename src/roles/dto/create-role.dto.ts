import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Unique } from 'src/common/decorators/unique.decorator';
import { Role } from '../entities/role.entity';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  @Unique({ entity: Role, column: 'name' })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
