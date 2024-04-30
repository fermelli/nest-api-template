import { Transform } from 'class-transformer';
import { IsOptional, IsBoolean } from 'class-validator';

export class WithDeletedDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => [true, 'true', 1, '1', 'yes', 'on'].includes(value))
  withDeleted?: boolean;
}
