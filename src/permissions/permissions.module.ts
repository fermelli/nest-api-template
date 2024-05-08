import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { TenantsModule } from 'src/tenants/tenants.module';

@Module({
  imports: [TypeOrmModule.forFeature([Permission]), TenantsModule],
  controllers: [PermissionsController],
  providers: [PermissionsService],
})
export class PermissionsModule {}
