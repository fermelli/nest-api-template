import { IsNotEmpty, ArrayNotEmpty, IsInt } from 'class-validator';

export class RolePermissionsDto {
  @IsNotEmpty()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  permissionsIds: number[];
}
