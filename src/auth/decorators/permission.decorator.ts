import { SetMetadata } from '@nestjs/common';
import { SlugedNamePermission } from '../enums/sluged-name-permission.enum';

export const PERMISSION_KEY = 'permission';

export const Permission = (permission: SlugedNamePermission) =>
  SetMetadata(PERMISSION_KEY, permission);
