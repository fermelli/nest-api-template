import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<string[]>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractTokenFromHeader(request);
    const secret = this.configService.get<string>('JWT_SECRET');

    if (!accessToken) {
      throw new UnauthorizedException('Missing access token');
    }

    try {
      const payload = await this.jwtService.verifyAsync<User>(accessToken, {
        secret,
      });

      request.user = payload;
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, accessToken] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? accessToken : undefined;
  }
}
