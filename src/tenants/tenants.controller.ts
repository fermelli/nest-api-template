import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dtos/create-tenant.dto';
import { FindOneUuidParams } from 'src/common/dtos/find-one-uuid-params.dto';
import { PaginationAndWithDeletedDto } from 'src/common/dtos/pagination-and-with-deleted.dto';
import { SlugedNamePermission } from 'src/auth/enums/sluged-name-permission.enum';
import { Permission } from 'src/auth/decorators/permission.decorator';
import { UpdateTenantDto } from './dtos/update-tenant.dto';
import { WithDeletedDto } from 'src/common/dtos/with-deleted.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { UserResetPasswordDto } from './dtos/user-reset-password.dto';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  @Permission(SlugedNamePermission.CREATE_TENANT)
  async create(
    @Body() createTenantDto: CreateTenantDto,
    @GetUser() user: User,
  ) {
    return this.tenantsService.create(createTenantDto, user);
  }

  @Get()
  @Permission(SlugedNamePermission.READ_TENANTS)
  async findAll(@Query() query: PaginationAndWithDeletedDto) {
    return this.tenantsService.findAll(query);
  }

  @Get(':id')
  @Permission(SlugedNamePermission.READ_TENANT)
  async findOne(
    @Param() { id }: FindOneUuidParams,
    @Query() query: WithDeletedDto,
  ) {
    return this.tenantsService.findOne(id, query);
  }

  @Patch(':id')
  @Permission(SlugedNamePermission.UPDATE_TENANT)
  async update(
    @Param() { id }: FindOneUuidParams,
    @Body() updateTenantDto: UpdateTenantDto,
  ) {
    return this.tenantsService.update(id, updateTenantDto);
  }

  @Delete(':id/soft')
  @Permission(SlugedNamePermission.INACTIVATE_TENANT)
  softRemove(@Param() { id }: FindOneUuidParams) {
    return this.tenantsService.softRemove(id);
  }

  @Patch(':id/restore')
  @Permission(SlugedNamePermission.ACTIVATE_TENANT)
  restore(@Param() { id }: FindOneUuidParams) {
    return this.tenantsService.restore(id);
  }

  @Get(':id/users')
  @Permission(SlugedNamePermission.READ_TENANT_USERS)
  async findAllUsers(@Param() { id }: FindOneUuidParams) {
    return this.tenantsService.findAllUsers(id);
  }

  @Patch(':id/users/:userId/reset-password')
  @Permission(SlugedNamePermission.RESET_TENANT_USER_PASSWORD)
  resetUserPassword(@Param() { id, userId }: UserResetPasswordDto) {
    return this.tenantsService.resetUserPassword(id, userId);
  }
}
