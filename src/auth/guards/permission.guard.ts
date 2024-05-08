import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Scope,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SlugedNamePermission } from '../enums/sluged-name-permission.enum';
import { PERMISSION_KEY } from '../decorators/permission.decorator';
import { UsersService } from 'src/users/users.service';

@Injectable({ scope: Scope.REQUEST })
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission =
      this.reflector.getAllAndOverride<SlugedNamePermission>(PERMISSION_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

    if (!requiredPermission) {
      return Promise.resolve(true);
    }

    const { user } = context.switchToHttp().getRequest();
    const permissions = (await this.usersService.findAllPermissions(user.id))
      .data;

    return Promise.resolve(
      permissions.some(
        (permission) => permission.slugedName === requiredPermission,
      ),
    );
  }
}
