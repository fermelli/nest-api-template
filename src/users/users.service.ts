import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { User } from './entities/user.entity';
import { Equal, In, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseCustom } from 'src/app/interfaces/response-custom.interface';
import { Pagination } from 'nestjs-typeorm-paginate';
import { PaginationAndWithDeletedDto } from 'src/common/dtos/pagination-and-with-deleted.dto';
import { WithDeletedDto } from 'src/common/dtos/with-deleted.dto';
import { ConfigService } from '@nestjs/config';
import { hashSync } from 'bcrypt';
import { Role } from 'src/roles/entities/role.entity';
import { UserRolesDto } from './dto/user-roles.dto';
import { UserPermissionsDto } from './dto/user-permissions.dto';
import { Permission } from 'src/permissions/entities/permission.entity';
import {
  mergeDataByPropertyAndOrder,
  responsePaginateData,
} from 'src/common/utils';

@Injectable()
export class UsersService extends BaseService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,

    private readonly configService: ConfigService,
  ) {
    super();
  }

  async create(createUserDto: CreateUserDto): Promise<ResponseCustom<User>> {
    const defaultPassword = this.configService.get<string>(
      'USER_DEFAULT_PASSWORD',
      'NestAPI@2023',
    );

    try {
      const user = this.userRepository.create({
        password: hashSync(defaultPassword, 10),
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
    const response = await responsePaginateData<User>(
      this.userRepository,
      {
        relations: {
          roles: {
            permissions: true,
          },
          permissions: true,
        },
        withDeleted,
        resourceName: 'Users',
      },
      {
        limit,
        page,
      },
    );

    return response;
  }

  async findOne(
    id: number,
    query: WithDeletedDto,
  ): Promise<ResponseCustom<User>> {
    const { withDeleted } = query;
    const user = await this.userRepository.findOne({
      where: { id: Equal(id) },
      relations: {
        roles: {
          permissions: true,
        },
        permissions: true,
      },
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
    const user = (await this.findOne(id, query)).data;

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
    const user = (await this.findOne(id, { withDeleted: false })).data;

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
    const user = (await this.findOne(id, { withDeleted: true })).data;

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

  async assignRoles(
    id: number,
    { rolesIds }: UserRolesDto,
  ): Promise<ResponseCustom<User>> {
    const user = (await this.findOne(id, { withDeleted: false })).data;
    const queryRunner =
      this.userRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const roles = await this.roleRepository.find({
      where: { id: In(rolesIds) },
    });

    if (roles.length !== rolesIds.length) {
      throw new NotFoundException('Some roles not found');
    }

    try {
      user.roles = roles;

      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();

      return {
        message: 'User roles set successfully',
        data: user,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      this.handleErrors(error);
    } finally {
      await queryRunner.release();
    }
  }

  async assignPermissions(
    id: number,
    { permissionsIds }: UserPermissionsDto,
  ): Promise<ResponseCustom<User>> {
    const user = (await this.findOne(id, { withDeleted: false })).data;
    const queryRunner =
      this.userRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const permissions = await this.permissionRepository.find({
      where: { id: In(permissionsIds) },
    });

    if (permissions.length !== permissionsIds.length) {
      throw new NotFoundException('Some permissions not found');
    }

    try {
      user.permissions = permissions;

      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();

      return {
        message: 'User permissions set successfully',
        data: user,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      this.handleErrors(error);
    } finally {
      await queryRunner.release();
    }
  }

  async findAllPermissions(id: number): Promise<ResponseCustom<Permission[]>> {
    const user = await this.userRepository.findOne({
      where: { id: Equal(id) },
      relations: {
        roles: {
          permissions: true,
        },
        permissions: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const permissionsFromRoles = user.roles.reduce(
      (acc, role) => [...acc, ...role.permissions],
      [] as Permission[],
    );

    const permissions = mergeDataByPropertyAndOrder(
      [...permissionsFromRoles, ...user.permissions],
      'id',
    );

    return {
      message: 'User permissions retrieved successfully',
      data: permissions,
    };
  }
}
