import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { FindOneParams } from 'src/common/dtos/find-one-params.dto';
import { RolePermissionsDto } from './dto/role-permissions.dto';
import { PaginationAndWithDeletedDto } from 'src/common/dtos/pagination-and-with-deleted.dto';
import { SlugedNamePermission } from 'src/auth/enums/sluged-name-permission.enum';
import { Permission } from 'src/auth/decorators/permission.decorator';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Permission(SlugedNamePermission.CREATE_ROLE)
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @Permission(SlugedNamePermission.READ_ROLES)
  findAll(@Query() query: PaginationAndWithDeletedDto) {
    return this.rolesService.findAll(query);
  }

  @Get(':id')
  @Permission(SlugedNamePermission.READ_ROLE)
  findOne(@Param() { id }: FindOneParams) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @Permission(SlugedNamePermission.UPDATE_ROLE)
  update(@Param() { id }: FindOneParams, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @Permission(SlugedNamePermission.DELETE_ROLE)
  remove(@Param() { id }: FindOneParams) {
    return this.rolesService.remove(id);
  }

  @Post(':id/assign-permissions')
  @Permission(SlugedNamePermission.ASSIGN_PERMISSIONS_TO_ROLE)
  assignPermissions(
    @Param() { id }: FindOneParams,
    @Body() rolePermissionsDto: RolePermissionsDto,
  ) {
    return this.rolesService.assignPermissions(id, rolePermissionsDto);
  }
}
