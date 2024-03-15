import { ArrayNotEmpty, IsInt, IsNotEmpty } from 'class-validator';
import { Exists } from 'src/common/decorators/exists.decorator';
import { Role } from 'src/roles/entities/role.entity';

export class UserRolesDto {
  @IsNotEmpty()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Exists({ entity: Role, column: 'id' }, { each: true })
  rolesIds: number[];
}
