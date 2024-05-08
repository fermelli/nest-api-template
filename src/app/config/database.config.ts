import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
  type: configService.get<string>('DATABASE_LANLORD_TYPE', 'mysql') as
    | 'mysql'
    | 'mariadb',
  host: configService.get<string>('DATABASE_LANLORD_HOST', 'localhost'),
  port: parseInt(
    configService.get<string>('DATABASE_LANLORD_PORT', '3306'),
    10,
  ),
  username: configService.get<string>('DATABASE_LANLORD_USERNAME', 'root'),
  password: configService.get<string>('DATABASE_LANLORD_PASSWORD', ''),
  database: configService.get<string>('DATABASE_LANLORD_NAME', 'test'),
  synchronize: false,
  autoLoadEntities:
    configService.get<string>('DATABASE_LANLORD_AUTO_LOAD_ENTITIES', 'true') ===
    'true',
  logging:
    configService.get<string>('DATABASE_LANLORD_LOGGING', 'false') === 'true',
});
