import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, In, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { BaseService } from 'src/common/services/base.service';
import { ResponseCustom } from 'src/app/interfaces/response-custom.interface';
import { Permission } from 'src/permissions/entities/permission.entity';
import { RolePermissionsDto } from './dto/role-permissions.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { responsePaginateData } from 'src/common/utils';

@Injectable()
export class RolesService extends BaseService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {
    super();
  }

  async create(createRoleDto: CreateRoleDto): Promise<ResponseCustom<Role>> {
    try {
      const role = this.roleRepository.create(createRoleDto);

      await this.roleRepository.save(role);

      return {
        message: 'Role created successfully',
        data: role,
      };
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async findAll(
    query: PaginationDto,
  ): Promise<ResponseCustom<Pagination<Role>>> {
    const { limit, page } = query;
    const response = await responsePaginateData<Role>(
      this.roleRepository,
      {
        relations: {
          permissions: true,
        },
        resourceName: 'Roles',
      },
      {
        limit,
        page,
      },
    );

    return response;
  }

  async findOne(id: number): Promise<ResponseCustom<Role>> {
    const role = await this.roleRepository.findOne({
      where: { id: Equal(id) },
      relations: {
        permissions: true,
      },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return {
      message: 'Role retrieved successfully',
      data: role,
    };
  }

  async update(
    id: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<ResponseCustom<Role>> {
    const role = await this.roleRepository.preload({
      id,
      ...updateRoleDto,
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    try {
      await this.roleRepository.save(role);

      return {
        message: 'Role updated successfully',
        data: role,
      };
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async remove(id: number): Promise<ResponseCustom<Role>> {
    const role = (await this.findOne(id)).data;

    try {
      await this.roleRepository.remove(role);

      return {
        message: 'Role deleted successfully',
        data: role,
      };
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async assignPermissions(
    id: number,
    { permissionsIds }: RolePermissionsDto,
  ): Promise<ResponseCustom<Role>> {
    const role = (await this.findOne(id)).data;
    const queryRunner =
      this.roleRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const permissions = await this.permissionRepository.find({
      where: { id: In(permissionsIds) },
    });

    if (permissions.length !== permissionsIds.length) {
      throw new NotFoundException('Some permissions not found');
    }

    try {
      role.permissions = permissions;

      await queryRunner.manager.save(role);

      await queryRunner.commitTransaction();

      return {
        message: 'Permissions assigned successfully',
        data: role,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      this.handleErrors(error);
    } finally {
      await queryRunner.release();
    }
  }
}
