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

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  findAll(@Query() query: PaginationAndWithDeletedDto) {
    return this.rolesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param() { id }: FindOneParams) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  update(@Param() { id }: FindOneParams, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param() { id }: FindOneParams) {
    return this.rolesService.remove(id);
  }

  @Post(':id/assign-permissions')
  assignPermissions(
    @Param() { id }: FindOneParams,
    @Body() rolePermissionsDto: RolePermissionsDto,
  ) {
    return this.rolesService.assignPermissions(id, rolePermissionsDto);
  }
}
