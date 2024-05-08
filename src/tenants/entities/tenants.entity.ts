import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tenants' })
export class Tenant {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'user_id', type: 'int', unsigned: true, nullable: false })
  userId: number;

  @Column({
    name: 'super_admin_name',
    type: 'varchar',
    length: 48,
    nullable: false,
  })
  superAdminName: string;

  @Column({
    name: 'super_admin_email',
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  superAdminEmail: string;

  @Column({
    name: 'super_admin_password',
    type: 'varchar',
    length: 255,
    nullable: false,
    select: false,
  })
  superAdminPassword: string;

  @Column({
    name: 'db_user',
    type: 'varchar',
    length: 32,
    nullable: false,
    unique: true,
  })
  dbUser: string;

  @Column({
    name: 'db_password',
    type: 'varchar',
    length: 32,
    nullable: false,
  })
  dbPassword: string;

  @Column({
    name: 'db_name',
    type: 'varchar',
    length: 64,
    nullable: false,
    unique: true,
  })
  dbName: string;

  @Column({
    name: 'db_pool_size',
    type: 'smallint',
    unsigned: true,
    nullable: false,
    default: 10,
  })
  dbPoolSize: number;

  @Column({ name: 'start_date', type: 'timestamp', nullable: false })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp', nullable: false })
  endDate: Date;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  deletedAt?: Date | null;

  @ManyToOne(() => User, (user) => user.tenants)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
