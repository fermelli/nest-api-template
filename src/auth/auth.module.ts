import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/app/config/jwt.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Role } from 'src/roles/entities/role.entity';
import { Permission } from 'src/permissions/entities/permission.entity';
import { PermissionGuard } from './guards/permission.guard';
import { TenantsModule } from 'src/tenants/tenants.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: jwtConfig,
      inject: [ConfigService],
    }),
    TenantsModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    ConfigService,
    JwtStrategy,
    UsersService,
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AuthModule {}
