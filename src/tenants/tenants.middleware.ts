import {
  Injectable,
  NestMiddleware,
  Scope,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { getTenantDataSource } from './tenants.data-source';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { getTenant } from './utils/functions.util';

@Injectable({ scope: Scope.REQUEST })
export class TenantsMiddleware implements NestMiddleware {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly dataSource: DataSource,

    private readonly configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const tenant = await getTenant(req, this.dataSource);

    try {
      await getTenantDataSource(tenant, this.configService);

      next();
    } catch (error) {
      const message = `Error: ${error.message}`;

      console.log(error);

      this.logger.log(message);

      throw new NotFoundException('Tenant not found');
    }
  }
}
