import { Type } from 'class-transformer';
import { IsNotEmpty, IsInt } from 'class-validator';
import { Exists } from 'src/common/decorators/exists.decorator';
import { Role } from '../entities/role.entity';

export class RolesDto {
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Exists({ entity: Role, column: 'id' })
  id: number;
}
