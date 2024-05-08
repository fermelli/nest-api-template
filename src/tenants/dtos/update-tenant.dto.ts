import { OmitType } from '@nestjs/mapped-types';
import { CreateTenantDto } from './create-tenant.dto';

export class UpdateTenantDto extends OmitType(CreateTenantDto, [
  'superAdminName',
  'superAdminEmail',
  'vigency',
  'vigencyUnit',
] as const) {}
