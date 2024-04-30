import { Transform } from 'class-transformer';
import { IsOptional, IsBoolean } from 'class-validator';
import { transformToBoolean } from '../utils';

export class WithDeletedDto {
  @Transform(transformToBoolean)
  @IsOptional()
  @IsBoolean()
  withDeleted?: boolean;
}
