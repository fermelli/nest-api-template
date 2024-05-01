import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
  type: configService.get<string>('DATABASE_TYPE', 'mysql') as
    | 'mysql'
    | 'mariadb',
  host: configService.get<string>('DATABASE_HOST', 'localhost'),
  port: parseInt(configService.get<string>('DATABASE_PORT', '3306'), 10),
  username: configService.get<string>('DATABASE_USERNAME', 'root'),
  password: configService.get<string>('DATABASE_PASSWORD', ''),
  database: configService.get<string>('DATABASE_NAME', 'test'),
  synchronize:
    configService.get<string>('DATABASE_SYNCHRONIZE', 'false') === 'true',
  autoLoadEntities:
    configService.get<string>('DATABASE_AUTO_LOAD_ENTITIES', 'true') === 'true',
  logging: configService.get<string>('DATABASE_LOGGING', 'false') === 'true',
  migrations: ['dist/database/migrations/*.{ts,js}'],
  migrationsTableName: configService.get<string>(
    'DATABASE_MIGRATIONS_TABLE_NAME',
    'migrations',
  ),
  migrationsRun:
    configService.get<string>('DATABASE_MIGRATIONS_RUN', 'false') === 'true',
});
