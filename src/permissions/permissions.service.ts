import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { Permission } from './entities/permission.entity';
import { ResponseCustom } from 'src/app/interfaces/response-custom.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { responsePaginateData } from 'src/common/utils';

@Injectable()
export class PermissionsService extends BaseService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {
    super();
  }

  async findAll(
    query: PaginationDto,
  ): Promise<ResponseCustom<Pagination<Permission>>> {
    const { limit, page } = query;
    const response = await responsePaginateData<Permission>(
      this.permissionRepository,
      {
        relations: {
          roles: true,
        },
        resourceName: 'Permissions',
      },
      {
        limit,
        page,
      },
    );

    return response;
  }

  async findOne(id: number): Promise<ResponseCustom<Permission>> {
    const permission = await this.permissionRepository.findOne({
      where: { id: Equal(id) },
      relations: {
        roles: true,
      },
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return {
      message: 'Permission retrieved successfully',
      data: permission,
    };
  }

  async findAllGrouped(): Promise<
    ResponseCustom<Record<string, Permission[]>>
  > {
    const permissions = await this.permissionRepository.find();

    const permissionsGrouped = permissions.reduce((acc, permission) => {
      if (!acc[permission.group]) {
        acc[permission.group] = [];
      }

      acc[permission.group].push(permission);

      return acc;
    }, {} as Record<string, Permission[]>);

    return {
      message: 'Permissions grouped retrieved successfully',
      data: permissionsGrouped,
    };
  }
}
