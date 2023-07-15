import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default async (
  configService: ConfigService,
): Promise<JwtModuleOptions> => ({
  global: true,
  secret: configService.get<string>('JWT_SECRET') || 'secret',
  signOptions: {
    expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '4h',
  },
});
