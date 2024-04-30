import { Pagination } from 'nestjs-typeorm-paginate';
import { ResponseCustom } from 'src/app/interfaces/response-custom.interface';
import { FindManyOptions, Repository } from 'typeorm';

export interface FindCustomOptions<Entity = any>
  extends Omit<FindManyOptions<Entity>, 'skip' | 'take'> {
  resourceName: string;
}

export interface paginationCustomOptions {
  limit: number;
  page: number;
}

export async function responsePaginateData<T = any>(
  repository: Repository<T>,
  options: FindCustomOptions<T>,
  paginationOptions: paginationCustomOptions,
): Promise<ResponseCustom<Pagination<T>>> {
  const { resourceName } = options;
  const { limit, page } = paginationOptions;
  const [roles, count] = await repository.findAndCount({
    ...options,
    take: limit,
    skip: limit * (page - 1),
  });

  return {
    message: `${resourceName} retrieved successfully`,
    data: {
      items: roles,
      meta: {
        totalItems: count,
        itemCount: roles.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      },
    },
  };
}

export function mergeDataByProperty<T>(property: string) {
  return (acc: T[], datum: T) => {
    const index = acc.findIndex((p) => p[property] === datum[property]);

    if (index === -1) {
      return [...acc, datum];
    }

    return acc;
  };
}

export function mergeDataByPropertyAndOrder<T>(data: T[], property: string) {
  return data
    .reduce(mergeDataByProperty(property), [] as T[])
    .sort((a, b) => a[property] - b[property]);
}

export const transformToBoolean = ({ value }) => {
  if (value === undefined || value === null) {
    return !!value;
  }

  if ([true, 'true', 1, '1'].includes(value)) {
    return true;
  }

  if ([false, 'false', 0, '0'].includes(value)) {
    return false;
  }

  return value;
};
