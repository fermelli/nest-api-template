import { Provider, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { getTenantDataSource } from './tenants.data-source';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { getTenant } from './utils/functions.util';

export const TENANT_DATA_SOURCE = 'TENANT_DATA_SOURCE';

export const TenantsProvider: Provider = {
  provide: TENANT_DATA_SOURCE,
  inject: [REQUEST, DataSource, ConfigService],
  scope: Scope.REQUEST,
  useFactory: async (
    req: Request,
    dataSource: DataSource,
    configService: ConfigService,
  ) => {
    const tenant = await getTenant(req, dataSource);

    const tenantDatasource: DataSource = await getTenantDataSource(
      tenant,
      configService,
    );

    return tenantDatasource;
  },
};
