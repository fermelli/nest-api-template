import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { compareSync, hashSync } from 'bcrypt';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 48, nullable: false })
  name: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 128,
    unique: true,
    nullable: false,
  })
  email: string;

  @Exclude()
  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
    nullable: false,
    select: false,
  })
  password: string;

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

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  comparePassword(password: string): boolean {
    return compareSync(password, this.password);
  }

  @BeforeInsert()
  cryptPassword() {
    this.password = hashSync(this.password, 10);
  }
}
