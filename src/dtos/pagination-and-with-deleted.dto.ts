import { IntersectionType } from '@nestjs/mapped-types';
import { PaginationDto } from './pagination.dto';
import { WithDeletedDto } from './with-deleted.dto';

export class PaginationAndWithDeletedDto extends IntersectionType(
  PaginationDto,
  WithDeletedDto,
) {}
