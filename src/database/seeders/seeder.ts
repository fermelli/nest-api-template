import { DataSource } from 'typeorm';
import { PERMISSIONS_DATA } from './data/permissions.data';
import { Permission } from 'src/permissions/entities/permission.entity';
import { Logger } from '@nestjs/common';
import { Role } from 'src/roles/entities/role.entity';
import { SUPER_ADMIN_ROLE_DATA } from './data/super-admin-role.data';
import { User } from 'src/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { hashSync } from 'bcrypt';

export class Seeder {
  private static readonly logger = new Logger(this.name);

  static async run(
    dataSource: DataSource,
    configService: ConfigService,
  ): Promise<void> {
    await this.seedPermissions(dataSource);
    await this.seedSuperAdminRole(dataSource);
    await this.seedSuperAdminUser(dataSource, configService);
  }

  static async seedPermissions(dataSource: DataSource): Promise<void> {
    const permissionRepository = dataSource.getRepository(Permission);
    const permissions: Permission[] = PERMISSIONS_DATA.map((permissionData) => {
      const permission = permissionRepository.create(permissionData);

      return permission;
    });

    try {
      await permissionRepository.save(permissions);

      this.logger.log('Permissions seeded successfully');
    } catch (error) {
      this.logger.error(error);
    }
  }

  static async seedSuperAdminRole(dataSource: DataSource): Promise<void> {
    const roleRepository = dataSource.getRepository(Role);
    const adminRole = roleRepository.create({
      ...SUPER_ADMIN_ROLE_DATA,
      permissions: PERMISSIONS_DATA,
    });

    try {
      await roleRepository.save(adminRole);

      this.logger.log('Super Admin Role seeded successfully');
    } catch (error) {
      this.logger.error(error);
    }
  }

  static async seedSuperAdminUser(
    dataSource: DataSource,
    configService: ConfigService,
  ): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    const defaultName = configService.get<string>(
      'SUPER_ADMIN_USER_DEFAULT_NAME',
      'Super Admin',
    );
    const defaultEmail = configService.get<string>(
      'SUPER_ADMIN_USER_DEFAULT_EMAIL',
      'super-admin@nest-api-template.com',
    );
    const defaultPassword = configService.get<string>(
      'SUPER_ADMIN_USER_DEFAULT_PASSWORD',
      'NestAPISuperAdmin@2023',
    );
    const superAdminUser = userRepository.create({
      id: 1,
      name: defaultName,
      email: defaultEmail,
      password: hashSync(defaultPassword, 10),
      roles: [SUPER_ADMIN_ROLE_DATA],
    });

    try {
      await userRepository.save(superAdminUser);

      this.logger.log('Super Admin User seeded successfully');
    } catch (error) {
      this.logger.error(error);
    }
  }
}
