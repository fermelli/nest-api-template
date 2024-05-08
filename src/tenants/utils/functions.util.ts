import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { DataSource, Equal } from 'typeorm';
import { Tenant } from '../entities/tenants.entity';

export const getTenant = async (
  req: Request,
  dataSource: DataSource,
): Promise<Tenant> => {
  const tenantId: string = req.headers['x-tenant-id'] as string;

  if (!tenantId) {
    throw new BadRequestException('Tenant id is required');
  }

  const tenant: Tenant = await dataSource.getRepository(Tenant).findOne({
    where: { id: Equal(tenantId) },
  });

  if (!tenant) {
    throw new NotFoundException('Tenant not found');
  }

  const currentDate: Date = new Date();

  if (currentDate < tenant.startDate || currentDate > tenant.endDate) {
    throw new BadRequestException('Tenant subscription expired');
  }

  return tenant;
};
