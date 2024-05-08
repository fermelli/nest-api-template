import { QueryRunner } from 'typeorm';
import createPermissionsTableFunction from './create-permissions-table.function';
import createRolePermissionTableFunction from './create-role-permission-table.function';
import createRolesTableFunction from './create-roles-table.function';
import createUserPermissionTableFunction from './create-user-permission-table.function';
import createUserRoleTableFunction from './create-user-role-table.function';
import createUsersTableFunction from './create-users-table.function';

export default async (queryRunner: QueryRunner) => {
  await createUsersTableFunction.up(queryRunner);
  await createRolesTableFunction.up(queryRunner);
  await createUserRoleTableFunction.up(queryRunner);
  await createPermissionsTableFunction.up(queryRunner);
  await createUserPermissionTableFunction.up(queryRunner);
  await createRolePermissionTableFunction.up(queryRunner);
};
