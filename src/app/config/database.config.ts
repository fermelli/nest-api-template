import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
  type: configService.get<'mysql' | 'mariadb'>('DATABASE_TYPE'),
  host: configService.get<string>('DATABASE_HOST'),
  port: configService.get<number>('DATABASE_PORT'),
  username: configService.get<string>('DATABASE_USERNAME'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('DATABASE_NAME'),
  synchronize: false,
  autoLoadEntities: configService.get<boolean>('DATABASE_AUTO_LOAD_ENTITIES'),
  logging: configService.get<boolean>('DATABASE_LOGGING'),
  migrations: ['dist/database/migrations/*.{ts,js}'],
  migrationsTableName: configService.get<string>(
    'DATABASE_MIGRATIONS_TABLE_NAME',
  ),
  migrationsRun: configService.get<boolean>('DATABASE_MIGRATIONS_RUN'),
});
