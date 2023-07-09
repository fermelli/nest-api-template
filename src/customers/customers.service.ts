import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ResponseCustom } from 'src/interfaces/response-custom.interface';
import { Customer } from './entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
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

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<ResponseCustom<Customer>> {
    const customer = await this.customerRepository.preload({
      id,
      ...updateCustomerDto,
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    try {
      await this.customerRepository.save(customer);

      return {
        message: 'Customer updated successfully',
        data: customer,
      };
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async remove(id: number): Promise<ResponseCustom<Customer>> {
    const customer = (await this.findOne(id)).data as Customer;

    try {
      await this.customerRepository.remove(customer);

      return {
        message: 'Customer deleted successfully',
        data: customer,
      };
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async softRemove(id: number): Promise<ResponseCustom<Customer>> {
    const customer = (await this.findOne(id)).data as Customer;

    try {
      await this.customerRepository.softRemove(customer);

      return {
        message: 'Customer deactivated successfully',
        data: customer,
      };
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async restore(id: number): Promise<ResponseCustom<Customer>> {
    const customer = await this.customerRepository.findOne({
      where: { id: Equal(id) },
      withDeleted: true,
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    try {
      await this.customerRepository.recover(customer);

      return {
        message: 'Customer activated successfully',
        data: customer,
      };
    } catch (error) {
      this.handleErrors(error);
    }
  }
}
