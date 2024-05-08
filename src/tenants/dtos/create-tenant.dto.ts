import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { VigencyUnits } from '../utils/enums.util';

export class CreateTenantDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(48)
  superAdminName: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(128)
  superAdminEmail: string;

  @IsOptional()
  @IsInt()
  @Min(10)
  @Max(100)
  dbPoolSize = 10;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  vigency: number;

  @IsNotEmpty()
  @IsEnum(VigencyUnits)
  vigencyUnit: VigencyUnits;
}
