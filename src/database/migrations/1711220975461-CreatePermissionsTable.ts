import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePermissionsTable1711220975461 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'permissions',
        columns: [
          {
            name: 'id',
            type: 'int',
            unsigned: true,
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '64',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'sluged_name',
            type: 'varchar',
            length: '128',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'group',
            type: 'varchar',
            length: '64',
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
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('permissions');
  }
}
