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

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  findAll(@Query() query: PaginationAndWithDeletedDto) {
    return this.customersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param() { id }: FindOneParams, @Query() query: WithDeletedDto) {
    return this.customersService.findOne(id, query);
  }

  @Patch(':id')
  update(
    @Param() { id }: FindOneParams,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param() { id }: FindOneParams, @Query() query: WithDeletedDto) {
    return this.customersService.remove(id, query);
  }

  @Delete(':id/soft')
  softRemove(@Param() { id }: FindOneParams) {
    return this.customersService.softRemove(id);
  }

  @Patch(':id/restore')
  restore(@Param() { id }: FindOneParams) {
    return this.customersService.restore(id);
  }
}
