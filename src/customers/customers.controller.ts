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
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { FindOneParams } from 'src/common/dtos/find-one-params.dto';
import { WithDeletedDto } from 'src/common/dtos/with-deleted.dto';
import { PaginationAndWithDeletedDto } from 'src/common/dtos/pagination-and-with-deleted.dto';
import { Permission } from 'src/auth/decorators/permission.decorator';
import { SlugedNamePermission } from 'src/auth/enums/sluged-name-permission.enum';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @Permission(SlugedNamePermission.CREATE_CUSTOMER)
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @Permission(SlugedNamePermission.READ_CUSTOMER)
  findAll(@Query() query: PaginationAndWithDeletedDto) {
    return this.customersService.findAll(query);
  }

  @Get(':id')
  @Permission(SlugedNamePermission.READ_CUSTOMER)
  findOne(@Param() { id }: FindOneParams, @Query() query: WithDeletedDto) {
    return this.customersService.findOne(id, query);
  }

  @Patch(':id')
  @Permission(SlugedNamePermission.UPDATE_CUSTOMER)
  update(
    @Param() { id }: FindOneParams,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @Permission(SlugedNamePermission.DELETE_CUSTOMER)
  remove(@Param() { id }: FindOneParams, @Query() query: WithDeletedDto) {
    return this.customersService.remove(id, query);
  }

  @Delete(':id/soft')
  @Permission(SlugedNamePermission.INACTIVATE_CUSTOMER)
  softRemove(@Param() { id }: FindOneParams) {
    return this.customersService.softRemove(id);
  }

  @Patch(':id/restore')
  @Permission(SlugedNamePermission.ACTIVATE_CUSTOMER)
  restore(@Param() { id }: FindOneParams) {
    return this.customersService.restore(id);
  }
}
