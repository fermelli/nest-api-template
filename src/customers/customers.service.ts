import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll(): Promise<ResponseCustom<Customer>> {
    const customers = await this.customerRepository.find();

    return {
      message: 'Customers retrieved successfully',
      data: customers,
    };
  }

  async findOne(id: number): Promise<ResponseCustom<Customer>> {
    const customer = await this.customerRepository.findOneBy({ id });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return {
      message: 'Customer retrieved successfully',
      data: customer,
    };
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
