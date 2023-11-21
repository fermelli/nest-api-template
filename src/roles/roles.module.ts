import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Permission } from 'src/permissions/entities/permission.entity';
import { RolePermission } from './entities/role-permission.entity';
import { ExistsConstraint } from 'src/common/decorators/exists.decorator';
import { UniqueConstraint } from 'src/common/decorators/unique.decorator';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission, RolePermission])],
  controllers: [RolesController],
  providers: [RolesService, ExistsConstraint, UniqueConstraint],
})
export class RolesModule {}
