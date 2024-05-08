import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { Tenant } from './entities/tenants.entity';
import { DataSource, Equal, Repository } from 'typeorm';
import { ResponseCustom } from 'src/app/interfaces/response-custom.interface';
import { CreateTenantDto } from './dtos/create-tenant.dto';
import { getTenantsDatabaseDataSource } from 'src/database/tenants-database.data-source';
import runFunction from 'src/database/functions/run.function';
import { ConfigService } from '@nestjs/config';
import { PaginationAndWithDeletedDto } from 'src/common/dtos/pagination-and-with-deleted.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { responsePaginateData } from 'src/common/utils';
import { TenantQuery, TenantUser } from './querys/tenants.query';
import { UpdateTenantDto } from './dtos/update-tenant.dto';
import { WithDeletedDto } from 'src/common/dtos/with-deleted.dto';
import { User } from 'src/users/entities/user.entity';
import { getVigencyDates } from './utils/functions.util';

@Injectable()
export class TenantsService extends BaseService {
  private readonly dataSource: DataSource = getTenantsDatabaseDataSource(
    this.configService,
  );

  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,

    private readonly configService: ConfigService,
  ) {
    super();
  }

  async create(
    @Body() createTenantDto: CreateTenantDto,
    user: User,
  ): Promise<ResponseCustom<Tenant>> {
    const {
      superAdminName: name,
      superAdminEmail: email,
      vigency,
      vigencyUnit,
    } = createTenantDto;
    const password = this.configService.get<string>(
      'TENANT_SUPER_ADMIN_USER_DEFAULT_PASSWORD',
      'DemoTenant@2024',
    );
    const dbUserPrefix = this.configService.get<string>(
      'DATABASE_TENANTS_USER_PREFIX',
      'user_',
    );
    const dbPrefix = this.configService.get<string>(
      'DATABASE_TENANTS_PREFIX',
      'tenant_db_',
    );
    const dbPasswordPrefix = this.configService.get<string>(
      'DATABASE_TENANTS_PASSWORD_PREFIX',
      'pwd_',
    );
    const { dbUser, dbName, dbPassword } = TenantQuery.generateDatabaseData({
      dbUserPrefix,
      dbPrefix,
      dbPasswordPrefix,
    });
    const { startDate, endDate } = getVigencyDates(vigency, vigencyUnit);
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await TenantQuery.createDatabase(queryRunner, {
        dbName,
        dbUser,
        dbPassword,
      });
      await runFunction(queryRunner);
      await TenantQuery.runSeed(queryRunner, { name, email, password });

      const tenant = this.tenantRepository.create({
        ...createTenantDto,
        superAdminPassword: password,
        dbUser,
        dbPassword,
        dbName,
        user,
        startDate,
        endDate,
      });

      await this.tenantRepository.save(tenant);

      await queryRunner.commitTransaction();

      return {
        message: 'Tenant created successfully',
        data: tenant,
      };
    } catch (error) {
      await TenantQuery.dropDatabaseIfExists(queryRunner, dbName);

      await queryRunner.rollbackTransaction();

      this.handleErrors(error);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    query: PaginationAndWithDeletedDto,
  ): Promise<ResponseCustom<Pagination<Tenant>>> {
    const { withDeleted, limit, page } = query;
    const response = await responsePaginateData<Tenant>(
      this.tenantRepository,
      {
        withDeleted,
        resourceName: 'Tenants',
      },
      {
        limit,
        page,
      },
    );

    return response;
  }

  async findOne(
    id: string,
    query: WithDeletedDto,
  ): Promise<ResponseCustom<Tenant>> {
    const { withDeleted } = query;
    const tenant = await this.tenantRepository.findOne({
      where: { id: Equal(id) },
      withDeleted,
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return {
      message: 'Tenant retrieved successfully',
      data: tenant,
    };
  }

  async update(
    id: string,
    updateTenantDto: UpdateTenantDto,
  ): Promise<ResponseCustom<Tenant>> {
    const tenant = await this.tenantRepository.preload({
      id,
      ...updateTenantDto,
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    try {
      await this.tenantRepository.save(tenant);

      return {
        message: 'Tenant updated successfully',
        data: tenant,
      };
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async softRemove(id: string): Promise<ResponseCustom<Tenant>> {
    const tenant = (await this.findOne(id, { withDeleted: false })).data;

    try {
      await this.tenantRepository.softRemove(tenant);

      return {
        message: 'Tenant deactivated successfully',
        data: tenant,
      };
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async restore(id: string): Promise<ResponseCustom<Tenant>> {
    const tenant = (await this.findOne(id, { withDeleted: true })).data;

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    try {
      await this.tenantRepository.recover(tenant);

      return {
        message: 'Tenant activated successfully',
        data: tenant,
      };
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async findAllUsers(id: string): Promise<ResponseCustom<TenantUser[]>> {
    const tenant = (await this.findOne(id, { withDeleted: false })).data;
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      const tenantUsers = await TenantQuery.findAllUsers(
        queryRunner,
        tenant.dbName,
      );

      return {
        message: 'Tenant users retrieved successfully',
        data: tenantUsers,
      };
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async resetUserPassword(
    id: string,
    userId: number,
  ): Promise<ResponseCustom<TenantUser>> {
    const tenant = (await this.findOne(id, { withDeleted: false })).data;
    const password = this.configService.get<string>(
      'TENANT_SUPER_ADMIN_USER_DEFAULT_PASSWORD',
      'DemoTenant@2024',
    );
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      const tenantUser = await TenantQuery.resetUserPassword(
        queryRunner,
        tenant.dbName,
        userId,
        password,
      );

      await this.tenantRepository.save(tenant);

      return {
        message: 'Tenant user password reset successfully',
        data: tenantUser,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      this.handleErrors(error);
    }
  }
}
