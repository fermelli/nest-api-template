import { Controller, Get, Param, Delete, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { FindOneParams } from 'src/common/dtos/find-one-params.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.permissionsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param() { id }: FindOneParams) {
    return this.permissionsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param() { id }: FindOneParams) {
    return this.permissionsService.remove(id);
  }
}
