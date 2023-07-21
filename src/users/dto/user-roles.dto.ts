import { ArrayNotEmpty, IsInt, IsNotEmpty } from 'class-validator';

export class UserRolesDto {
  @IsNotEmpty()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  rolesIds: number[];
}
