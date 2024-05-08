import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

export const getTenantsDatabaseDataSource = (configService: ConfigService) => {
  const dataSourceOptions: DataSourceOptions = {
    type: configService.get<string>('DATABASE_TENANTS_TYPE', 'mysql') as
      | 'mysql'
      | 'mariadb',
    host: configService.get<string>('DATABASE_TENANTS_HOST', 'localhost'),
    port: parseInt(
      configService.get<string>('DATABASE_TENANTS_PORT', '3306'),
      10,
    ),
    username: configService.get<string>('DATABASE_TENANTS_USERNAME', 'root'),
    password: configService.get<string>('DATABASE_TENANTS_PASSWORD', ''),
  };
  const dataSource = new DataSource(dataSourceOptions);

  if (!dataSource.isInitialized) {
    dataSource.initialize();
  }

  return dataSource;
};
