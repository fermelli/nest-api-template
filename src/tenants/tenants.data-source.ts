import { DataSource, DataSourceOptions } from 'typeorm';
import { Tenant } from './entities/tenants.entity';
import { ConfigService } from '@nestjs/config';

export interface TenantPool {
  [key: string]: {
    dataSources: DataSource[];
    lastIndex: number;
  };
}

export const tenantPools: TenantPool = {};

export const getTenantDataSource = async (
  tenant: Tenant,
  configService: ConfigService,
): Promise<DataSource> => {
  const poolSize = tenant.dbPoolSize;
  const dataSourceOptions: DataSourceOptions = {
    type: configService.get<string>('DATABASE_TENANTS_TYPE', 'mysql') as
      | 'mysql'
      | 'mariadb',
    host: configService.get<string>('DATABASE_TENANTS_HOST', 'localhost'),
    port: parseInt(
      configService.get<string>('DATABASE_TENANTS_PORT', '3306'),
      10,
    ),
    username: tenant.dbUser,
    password: tenant.dbPassword,
    database: tenant.dbName,
    entities: ['dist/**/*.entity{.ts,.js}'],
    poolSize: poolSize,
    extra: {
      connectionLimit: poolSize,
    },
  };

  if (!tenantPools?.[tenant.id]) {
    tenantPools[tenant.id] = {
      dataSources: [],
      lastIndex: -1,
    };
  }

  if (tenantPools[tenant.id].dataSources.length < poolSize) {
    const dataSource = new DataSource(dataSourceOptions);

    tenantPools[tenant.id].dataSources.push(dataSource);
  }

  tenantPools[tenant.id].lastIndex =
    (tenantPools[tenant.id].lastIndex + 1) % poolSize;

  const currentIndex = tenantPools[tenant.id].lastIndex;
  const currentTenantDataSource =
    tenantPools[tenant.id].dataSources[currentIndex];

  if (!currentTenantDataSource.isInitialized) {
    await currentTenantDataSource.initialize();
  }

  return currentTenantDataSource;
};
