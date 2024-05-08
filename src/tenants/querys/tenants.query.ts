import { BadRequestException, Logger } from '@nestjs/common';
import { hashSync } from 'bcrypt';
import { QueryRunner } from 'typeorm';
import { TENANTS_PERMISSIONS_DATA } from './data/tenants.permissions.data';
import { TENANTS_SUPER_ADMIN_ROLE_DATA } from './data/tenants.super-admin-role.data';

export interface TenantDatabasePrefixes {
  dbUserPrefix: string;
  dbPrefix: string;
  dbPasswordPrefix: string;
}

export interface TenantDatabaseData {
  dbUser: string;
  dbName: string;
  dbPassword: string;
}

export interface SuperAdminUserData {
  name: string;
  email: string;
  password: string;
}

export interface TenantUser {
  id: number;
  name: string;
  email: string;
}

export class TenantQuery {
  private static readonly logger = new Logger(this.name);

  static generateDatabaseData(
    prefixex: TenantDatabasePrefixes,
  ): TenantDatabaseData {
    const { dbUserPrefix, dbPrefix, dbPasswordPrefix } = prefixex;
    const time = new Date().getTime();

    return {
      dbUser: `${dbUserPrefix}${time}`,
      dbName: `${dbPrefix}${time}`,
      dbPassword: `${dbPasswordPrefix}${time}`,
    };
  }

  static async createDatabase(
    queryRunner: QueryRunner,
    databaseData: TenantDatabaseData,
  ): Promise<void> {
    const { dbName, dbUser, dbPassword } = databaseData;

    await queryRunner.createDatabase(dbName, true);
    await queryRunner.query(`
      CREATE USER '${dbUser}'@'%' IDENTIFIED BY '${dbPassword}';
    `);
    await queryRunner.query(`
      GRANT ALL PRIVILEGES ON ${dbName}.* TO '${dbUser}'@'%';
    `);
    await queryRunner.query(`USE ${dbName};`);
  }

  static async seedPermissions(queryRunner: QueryRunner): Promise<void> {
    const values = TENANTS_PERMISSIONS_DATA.map(
      (permission) =>
        `(${permission.id}, '${permission.name}', '${permission.slugedName}', '${permission.group}')`,
    ).join(', ');

    await queryRunner.query(
      `INSERT INTO \`permissions\` (\`id\`, \`name\`, \`sluged_name\`, \`group\`) VALUES ${values};`,
    );

    this.logger.log('Permissions seeded successfully');
  }

  static async dropDatabaseIfExists(
    queryRunner: QueryRunner,
    dbName: string,
  ): Promise<void> {
    await queryRunner.query(`DROP DATABASE IF EXISTS ${dbName};`);
  }

  static async seedSuperAdminRole(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO \`roles\` (\`id\`, \`name\`, \`description\`) VALUES (${TENANTS_SUPER_ADMIN_ROLE_DATA.id}, '${TENANTS_SUPER_ADMIN_ROLE_DATA.name}', '${TENANTS_SUPER_ADMIN_ROLE_DATA.description}');`,
    );

    const values = TENANTS_SUPER_ADMIN_ROLE_DATA.permissions
      .map(
        (permission) =>
          `(${TENANTS_SUPER_ADMIN_ROLE_DATA.id}, ${permission.id})`,
      )
      .join(', ');

    await queryRunner.query(
      `INSERT INTO \`role_permission\` (\`role_id\`, \`permission_id\`) VALUES ${values};`,
    );

    this.logger.log('Super Admin Role seeded successfully');
  }

  static async seedSuperAdminUser(
    queryRunner: QueryRunner,
    userData: SuperAdminUserData,
  ): Promise<void> {
    const { name, email, password } = userData;
    const passwordHash = hashSync(password, 10);

    await queryRunner.query(
      `INSERT INTO \`users\` (\`name\`, \`email\`, \`password\`) VALUES ('${name}', '${email}', '${passwordHash}');`,
    );

    await queryRunner.query(
      `INSERT INTO \`user_role\` (\`user_id\`, \`role_id\`) VALUES (1, 1);`,
    );

    this.logger.log('Super Admin User seeded successfully');
  }

  static async runSeed(
    queryRunner: QueryRunner,
    userData: SuperAdminUserData,
  ): Promise<void> {
    await this.seedPermissions(queryRunner);
    await this.seedSuperAdminRole(queryRunner);
    await this.seedSuperAdminUser(queryRunner, userData);
  }

  static async findAllUsers(
    queryRunner: QueryRunner,
    dbName: string,
  ): Promise<TenantUser[]> {
    await queryRunner.query(`USE ${dbName};`);

    const users = await queryRunner.query(`
      SELECT \`id\`, \`name\`, \`email\`
      FROM \`users\`;
    `);

    return users;
  }

  static async resetUserPassword(
    queryRunner: QueryRunner,
    dbName: string,
    userId: number,
    password: string,
  ): Promise<TenantUser> {
    await queryRunner.query(`USE ${dbName};`);

    const passwordHash = hashSync(password, 10);

    const user = await queryRunner.query(`
      SELECT \`id\`, \`name\`, \`email\`
      FROM \`users\`
      WHERE \`id\` = ${userId};
    `);

    if (user.length === 0) {
      throw new BadRequestException('Tenant user not found');
    }

    await queryRunner.query(`
      UPDATE \`users\`
      SET \`password\` = '${passwordHash}'
      WHERE \`id\` = ${userId};
    `);

    return user[0];
  }
}
