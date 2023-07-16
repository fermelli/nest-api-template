import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { User } from './entities/user.entity';
import { Equal, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseCustom } from 'src/app/interfaces/response-custom.interface';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { PaginationAndWithDeletedDto } from 'src/common/dtos/pagination-and-with-deleted.dto';
import { WithDeletedDto } from 'src/common/dtos/with-deleted.dto';
import { ConfigService } from '@nestjs/config';
import { hashSync } from 'bcrypt';

@Injectable()
export class UsersService extends BaseService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async create(createUserDto: CreateUserDto): Promise<ResponseCustom<User>> {
    try {
      const password = hashSync(
        this.configService.get<string>('USER_DEFAULT_PASSWORD'),
        10,
      );
      const user = this.userRepository.create({
        password,
        ...createUserDto,
      });

      await this.userRepository.save(user);

      delete user.password;

      return {
        message: 'User created successfully',
        data: user,
      };
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async findAll(
    query: PaginationAndWithDeletedDto,
  ): Promise<ResponseCustom<Pagination<User>>> {
    const { withDeleted, limit, page } = query;
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (withDeleted) {
      queryBuilder.withDeleted();
    }

    const paginateData = await paginate<User>(queryBuilder, {
      limit,
      page,
    });

    return {
      message: 'Users retrieved successfully',
      data: paginateData,
    };
  }

  async findOne(
    id: number,
    query: WithDeletedDto,
  ): Promise<ResponseCustom<User>> {
    const { withDeleted } = query;
    const user = await this.userRepository.findOne({
      where: { id: Equal(id) },
      withDeleted,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'User retrieved successfully',
      data: user,
    };
  }

  async findOneByEmail(email: string): Promise<ResponseCustom<User>> {
    const user = await this.userRepository.findOne({
      where: { email: Equal(email) },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
      withDeleted: true,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.deletedAt) {
      throw new UnauthorizedException('User not active');
    }

    return {
      message: 'User retrieved successfully',
      data: user,
    };
  }

  async remove(
    id: number,
    query: WithDeletedDto,
  ): Promise<ResponseCustom<User>> {
    const user = (await this.findOne(id, query)).data as User;

    try {
      await this.userRepository.remove(user);

      return {
        message: 'User deleted successfully',
        data: user,
      };
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async softRemove(id: number): Promise<ResponseCustom<User>> {
    const user = (await this.findOne(id, { withDeleted: false })).data as User;

    try {
      await this.userRepository.softRemove(user);

      return {
        message: 'User deactivated successfully',
        data: user,
      };
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async restore(id: number): Promise<ResponseCustom<User>> {
    const user = (await this.findOne(id, { withDeleted: true })).data as User;

    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      await this.userRepository.recover(user);

      return {
        message: 'User activated successfully',
        data: user,
      };
    } catch (error) {
      this.handleErrors(error);
    }
  }
}
