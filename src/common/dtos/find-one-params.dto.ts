import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class FindOneParams {
  @Type(() => Number)
  @IsNumber()
  id: number;
}
