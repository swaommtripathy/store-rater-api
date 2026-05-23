import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';

@Injectable()
export class StoresService {
  delete: any;
  findOne(storeId: number) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
  ) {}

  /**
   * Admin/Public: Fetch all stores with ascending name order.
   */
  async findAll(): Promise<Store[]> {
    return this.storesRepository.find({
      order: { name: 'ASC' },
    });
  }

  /**
   * Admin: Fetch all stores including their ratings for the Admin Dashboard.
   */
  async getAdminStores(): Promise<Store[]> {
    return this.storesRepository.find({
      relations: {
        ratings: true,
      },
      order: { name: 'ASC' },
    });
  }

  /**
   * Requirement: Store Owner Dashboard
   * Fetches the specific store owned by the user, including feedback and user details.
   */
  async getOwnerDashboard(userId: number): Promise<Store> {
    const store = await this.storesRepository.findOne({
      // FIXED: Use the 'owner' relation ID from the JWT, not a string name
      where: { owner: { id: userId } },
      relations: {
        ratings: {
          user: true,
        },
      },
    });

    if (!store) {
      throw new NotFoundException('No store found for this owner.');
    }

    return store;
  }

  /**
   * Creates a new store.
   */
  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const store: Store = this.storesRepository.create(createStoreDto);
    return await this.storesRepository.save(store);
  }

  /**
   * Updates the average rating value.
   * Triggered by the RatingsService after a new review is saved.
   */
  async updateAverageRating(storeId: number, newAverage: number): Promise<void> {
    await this.storesRepository.update(storeId, { averageRating: newAverage });
  }
}