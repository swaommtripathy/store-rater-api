import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Store } from '../stores/entities/store.entity';
import { Rating } from '../ratings/entities/rating.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Store) private storesRepository: Repository<Store>,
    @InjectRepository(Rating) private ratingsRepository: Repository<Rating>,
  ) {}

  async getDashboardStats() {
    const totalUsers = await this.usersRepository.count();
    const totalStores = await this.storesRepository.count();
    const totalRatings = await this.ratingsRepository.count();

    const users = await this.usersRepository.find({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      order: { createdAt: 'DESC' },
      take: 5,
    });

    const stores = await this.storesRepository.find({
      relations: { owner: true },
      order: { createdAt: 'DESC' },
      take: 5,
    });

    return {
      stats: {
        totalUsers,
        totalStores,
        totalRatings,
      },
      recentUsers: users,
      recentStores: stores,
    };
  }
}
