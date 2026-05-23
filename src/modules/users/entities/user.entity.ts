// src/modules/users/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Rating } from '../../ratings/entities/rating.entity';
import { Store } from '../../stores/entities/store.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  STORE_OWNER = 'store_owner',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 120 })
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false })
  password!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  @OneToMany(() => Rating, (rating) => rating.user)
  ratings!: Rating[];

  @OneToMany(() => Store, (store) => store.owner)
  ownedStores!: Store[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
