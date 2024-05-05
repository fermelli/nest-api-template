import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class FindOneParams {
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
