import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { transformToBoolean } from 'src/common/utils';

export enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

export class EnvironmentVariables {
  @IsNotEmpty()
  @IsString()
  HOST: string;

  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsNotEmpty()
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNotEmpty()
  @IsString()
  @IsIn(['mysql', 'mariadb'])
  DATABASE_TYPE: 'mysql' | 'mariadb';

  @IsNotEmpty()
  @IsString()
  DATABASE_HOST: string;

  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(65535)
  DATABASE_PORT: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  DATABASE_USERNAME: string;

  @IsString()
  DATABASE_PASSWORD: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  DATABASE_NAME: string;

  @Transform(transformToBoolean)
  @IsNotEmpty()
  @IsBoolean()
  DATABASE_SYNCHRONIZE: boolean;

  @Transform(transformToBoolean)
  @IsNotEmpty()
  @IsBoolean()
  DATABASE_AUTO_LOAD_ENTITIES: boolean;

  @Transform(transformToBoolean)
  @IsNotEmpty()
  @IsBoolean()
  DATABASE_LOGGING: boolean;

  @IsNotEmpty()
  @IsString()
  DATABASE_MIGRATIONS_TABLE_NAME: string;

  @Transform(transformToBoolean)
  @IsNotEmpty()
  @IsBoolean()
  DATABASE_MIGRATIONS_RUN: boolean;

  @IsNotEmpty()
  @IsString()
  @MinLength(32)
  JWT_SECRET: string;

  @IsNotEmpty()
  @IsString()
  JWT_EXPIRES_IN: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  USER_DEFAULT_PASSWORD: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(48)
  SUPER_ADMIN_USER_DEFAULT_NAME: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(128)
  SUPER_ADMIN_USER_DEFAULT_EMAIL: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  SUPER_ADMIN_USER_DEFAULT_PASSWORD: string;

  @IsNotEmpty()
  @IsString()
  CORS_ORIGIN: string;

  @IsString()
  @IsNotEmpty()
  CORS_METHODS: string;

  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  CORS_OPTIONS_SUCCESS_STATUS: number;

  @Transform(transformToBoolean)
  @IsNotEmpty()
  @IsBoolean()
  CORS_CREDENTIALS: boolean;

  @IsNotEmpty()
  @IsString()
  CORS_ALLOWED_HEADERS: string;

  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(86400)
  CORS_MAX_AGE: number;

  @IsNotEmpty()
  @IsString()
  DOCKER_IMAGE_NAME: string;

  @IsNotEmpty()
  @IsString()
  DOCKER_IMAGE_TAG: string;
}
