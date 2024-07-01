import { CreateUserDto } from './create-user.dto';
import { OmitType } from '@nestjs/mapped-types';

export class UpdateUserDto extends OmitType(CreateUserDto, [
  'name',
  'email',
] as const) {}
