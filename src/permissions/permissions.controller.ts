import { Controller, Get, Param, Delete, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { FindOneParams } from 'src/common/dtos/find-one-params.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Permission } from 'src/auth/decorators/permission.decorator';
import { SlugedNamePermission } from 'src/auth/enums/sluged-name-permission.enum';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @Permission(SlugedNamePermission.READ_PERMISSIONS)
  findAll(@Query() query: PaginationDto) {
    return this.permissionsService.findAll(query);
  }

  @Get(':id')
  @Permission(SlugedNamePermission.READ_PERMISSION)
  findOne(@Param() { id }: FindOneParams) {
    return this.permissionsService.findOne(id);
  }

  @Delete(':id')
  @Permission(SlugedNamePermission.DELETE_PERMISSION)
  remove(@Param() { id }: FindOneParams) {
    return this.permissionsService.remove(id);
  }
}
