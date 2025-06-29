import { ArrayNotEmpty, IsInt } from 'class-validator';
import { Exists } from 'src/common/decorators/exists.decorator';
import { Role } from 'src/roles/entities/role.entity';

export class UserRolesDto {
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Exists({ entity: Role, column: 'id' }, { each: true })
  rolesIds: number[];
}
