import { QueryRunner, Table } from 'typeorm';

export default {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'role_permission',
        columns: [
          {
            name: 'role_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            isPrimary: true,
          },
          {
            name: 'permission_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            isPrimary: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['role_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'roles',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['permission_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'permissions',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
      true,
      true,
    );
  },
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('role_permission');
  },
};
