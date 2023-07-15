import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class FindByEmail extends PickType(CreateUserDto, ['email'] as const) {}
