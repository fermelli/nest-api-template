import { Type } from 'class-transformer';
import { IsNotEmpty, IsInt } from 'class-validator';

export class RolesDto {
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  id: number;
}
