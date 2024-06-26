import { Role } from 'src/roles/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 64,
    nullable: false,
    unique: true,
  })
  name: string;

  @Column({
    name: 'sluged_name',
    type: 'varchar',
    length: 128,
    nullable: false,
    unique: true,
  })
  slugedName: string;

  @Column({ name: 'group', type: 'varchar', length: 64, nullable: false })
  group: string;

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

  @ManyToMany(() => User, (user) => user.permissions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'user_permission',
    joinColumn: { name: 'permission_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  users: User[];

  @ManyToMany(() => Role, (role) => role.permissions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'role_permission',
    joinColumn: { name: 'permission_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: Role[];
}
