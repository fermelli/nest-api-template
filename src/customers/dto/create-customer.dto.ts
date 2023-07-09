import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(16)
  document: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(48)
  names: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(48)
  surnames: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(16)
  phone: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  address: string;
}
