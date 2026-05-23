import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Rating } from '../../ratings/entities/rating.entity';
import { User } from '../../users/entities/user.entity';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  address!: string;

  @Column({ length: 50 })
  city!: string;

  @Column({ length: 50 })
  state!: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  averageRating!: number;

  @ManyToOne(() => User, (user) => user.ownedStores)
  owner!: User;

  @OneToMany(() => Rating, (rating) => rating.store)
  ratings!: Rating[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}