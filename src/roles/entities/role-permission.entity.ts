import { Entity, PrimaryColumn } from 'typeorm';

@Entity('role_permission')
export class RolePermission {
  @PrimaryColumn({ name: 'role_id', type: 'int', unsigned: true })
  roleId: number;

  @PrimaryColumn({ name: 'permission_id', type: 'int', unsigned: true })
  permissionId: number;
}
