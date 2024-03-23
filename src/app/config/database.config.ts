import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default (): TypeOrmModuleOptions => ({
  type: (process.env.DATABASE_TYPE as 'mysql' | 'mariadb') || 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
  username: process.env.DATABASE_USERNAME || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'test',
  synchronize: process.env.DATABASE_SYNCHRONIZE == 'true' || false,
  autoLoadEntities: process.env.DATABASE_AUTO_LOAD_ENTITIES == 'true' || false,
  logging: process.env.DATABASE_LOGGING == 'true' || false,
});
