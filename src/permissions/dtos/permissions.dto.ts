import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';
import { Exists } from 'src/common/decorators/exists.decorator';
import { Permission } from '../entities/permission.entity';

export class PermissionsDto {
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Exists({ entity: Permission, column: 'id' })
  id: number;
}
