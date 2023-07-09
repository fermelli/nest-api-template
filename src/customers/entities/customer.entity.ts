import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({
    name: 'document',
    type: 'varchar',
    length: 16,
    nullable: false,
    unique: true,
  })
  document: string;

  @Column({ name: 'names', type: 'varchar', length: 48, nullable: false })
  names: string;

  @Column({ name: 'surnames', type: 'varchar', length: 48, nullable: false })
  surnames: string;

  @Column({ name: 'phone', type: 'varchar', length: 16, nullable: false })
  phone: string;

  @Column({ name: 'address', type: 'varchar', length: 128, nullable: true })
  address?: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
  })
  deletedAt?: Date | null;
}
