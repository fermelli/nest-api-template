import { IsNotEmpty, ArrayNotEmpty, IsInt } from 'class-validator';

export class UserPermissionsDto {
  @IsNotEmpty()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  permissionsIds: number[];
}
