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
import { JwtStrategy } from '../strategies/jwt.strategy';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly jwtStrategy: JwtStrategy,
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
    const payload = await this.verifyToken(request);
    const user = await this.jwtStrategy.validate(payload);

    request.user = user as User;

    return true;
  }

  private async verifyToken(request: any): Promise<any> {
    const accessToken = this.extractTokenFromHeader(request);
    const secret = this.configService.get<string>('JWT_SECRET');

    if (!accessToken) {
      throw new UnauthorizedException('Missing access token');
    }

    try {
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret,
      });

      return payload;
    } catch {
      throw new UnauthorizedException('Access token is invalid');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, accessToken] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? accessToken : undefined;
  }
}
