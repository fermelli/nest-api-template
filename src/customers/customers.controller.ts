import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { FindOneParams } from 'src/dtos/find-one-params.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  findOne(@Param() { id }: FindOneParams) {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param() { id }: FindOneParams,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param() { id }: FindOneParams) {
    return this.customersService.remove(id);
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
