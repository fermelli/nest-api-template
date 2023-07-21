import { PartialType } from '@nestjs/mapped-types';
import { Permission } from 'src/permissions/entities/permission.entity';
import { User } from 'src/users/entities/user.entity';

export class Me extends PartialType(User) {
  permissions: Permission[];
}
