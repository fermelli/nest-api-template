import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export default new DataSource({
  type: (process.env.DATABASE_TYPE as 'mysql' | 'mariadb') || 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
  username: process.env.DATABASE_USERNAME || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'test',
  entities: ['dist/**/*.entity.{ts,js}'],
  migrations: ['src/database/migrations/*.{ts,js}'],
  migrationsTableName:
    process.env.DATABASE_MIGRATIONS_TABLE_NAME || 'migrations',
});
