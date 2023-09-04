import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationAndWithDeletedDto } from 'src/common/dtos/pagination-and-with-deleted.dto';
import { FindOneParams } from 'src/common/dtos/find-one-params.dto';
import { WithDeletedDto } from 'src/common/dtos/with-deleted.dto';
import { FindByEmail } from './dto/find-by-email.dto';
import { UserRolesDto } from './dto/user-roles.dto';
import { UserPermissionsDto } from './dto/user-permissions.dto';
import { Permission } from 'src/auth/decorators/permission.decorator';
import { SlugedNamePermission } from 'src/auth/enums/sluged-name-permission.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Permission(SlugedNamePermission.CREATE_USER)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Permission(SlugedNamePermission.READ_USERS)
  findAll(@Query() query: PaginationAndWithDeletedDto) {
    return this.usersService.findAll(query);
  }

  @Get('by-email')
  @Permission(SlugedNamePermission.FIND_BY_EMAIL_USER)
  findOneByEmail(@Body() { email }: FindByEmail) {
    return this.usersService.findOneByEmail(email);
  }

  @Get(':id')
  @Permission(SlugedNamePermission.READ_USER)
  findOne(@Param() { id }: FindOneParams, @Query() query: WithDeletedDto) {
    return this.usersService.findOne(id, query);
  }

  @Delete(':id')
  @Permission(SlugedNamePermission.DELETE_USER)
  remove(@Param() { id }: FindOneParams, @Query() query: WithDeletedDto) {
    return this.usersService.remove(id, query);
  }

  @Delete(':id/soft')
  @Permission(SlugedNamePermission.INACTIVATE_USER)
  softRemove(@Param() { id }: FindOneParams) {
    return this.usersService.softRemove(id);
  }

  @Patch(':id/restore')
  @Permission(SlugedNamePermission.ACTIVATE_USER)
  restore(@Param() { id }: FindOneParams) {
    return this.usersService.restore(id);
  }

  @Post(':id/assign-roles')
  @Permission(SlugedNamePermission.ASSIGN_ROLES_TO_USER)
  assignRoles(
    @Param() { id }: FindOneParams,
    @Body() userRolesDto: UserRolesDto,
  ) {
    return this.usersService.assignRoles(id, userRolesDto);
  }

  @Post(':id/assign-permissions')
  @Permission(SlugedNamePermission.ASSIGN_PERMISSIONS_TO_USER)
  assignPermissions(
    @Param() { id }: FindOneParams,
    @Body() userPermissionsDto: UserPermissionsDto,
  ) {
    return this.usersService.assignPermissions(id, userPermissionsDto);
  }

  @Get(':id/all-permissions')
  @Permission(SlugedNamePermission.FIND_ALL_PERMISSIONS_OF_USER)
  findAllPermissions(@Param() { id }: FindOneParams) {
    return this.usersService.findAllPermissions(id);
  }
}
