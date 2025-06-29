import { ArrayNotEmpty, IsInt } from 'class-validator';
import { Exists } from 'src/common/decorators/exists.decorator';
import { Permission } from 'src/permissions/entities/permission.entity';

export class UserPermissionsDto {
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Exists({ entity: Permission, column: 'id' }, { each: true })
  permissionsIds: number[];
}
