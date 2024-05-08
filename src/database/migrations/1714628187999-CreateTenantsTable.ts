import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTenantsTable1714628187999 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tenants',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isNullable: false,
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'user_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
          },
          {
            name: 'super_admin_name',
            type: 'varchar',
            length: '48',
            isNullable: false,
          },
          {
            name: 'super_admin_email',
            type: 'varchar',
            length: '128',
            isNullable: false,
          },
          {
            name: 'super_admin_password',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'db_user',
            type: 'varchar',
            length: '32',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'db_password',
            type: 'varchar',
            length: '32',
            isNullable: false,
          },
          {
            name: 'db_name',
            type: 'varchar',
            length: '64',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'db_pool_size',
            type: 'smallint',
            unsigned: true,
            isNullable: false,
            default: 10,
          },
          {
            name: 'start_date',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'end_date',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            length: '6',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP(6)',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            length: '6',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP(6)',
            onUpdate: 'CURRENT_TIMESTAMP(6)',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            length: '6',
            isNullable: true,
            default: null,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
            onUpdate: 'NO ACTION',
          },
        ],
      }),
      true,
      true,
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tenants');
  }
}
