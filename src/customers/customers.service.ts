import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ResponseCustom } from 'src/interfaces/response-custom.interface';
import { Customer } from './entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from 'src/base.service';

@Injectable()
export class CustomersService extends BaseService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {
    super();
  }

  async create(
    createCustomerDto: CreateCustomerDto,
  ): Promise<ResponseCustom<Customer>> {
    try {
      const customer = this.customerRepository.create(createCustomerDto);

      await this.customerRepository.save(customer);

      return {
        message: 'Customer created successfully',
        data: customer,
      };
    } catch (error) {
      this.handleErrors(error);
    }
  }

  findAll() {
    return `This action returns all customers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} customer`;
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
