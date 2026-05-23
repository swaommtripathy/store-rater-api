import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Store } from '../../stores/entities/store.entity';

@Entity('ratings')
export class Rating {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  rating!: number;

  @ManyToOne(() => User, (user) => user.ratings)
  user!: User;

  @ManyToOne(() => Store, (store) => store.ratings)
  store!: Store;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}