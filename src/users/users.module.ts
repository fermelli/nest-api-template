import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Role } from 'src/roles/entities/role.entity';
import { Permission } from 'src/permissions/entities/permission.entity';
import { TenantsModule } from 'src/tenants/tenants.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission]), TenantsModule],
  providers: [UsersService, ConfigService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
