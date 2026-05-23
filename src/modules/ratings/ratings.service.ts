import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { StoresService } from '../stores/stores.service';

@Injectable()
export class RatingsService {
  getRatingsForStore: any;
  constructor(
    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,
    private storesService: StoresService,
  ) {}

  async createOrUpdate(userId: number, storeId: number, score: number) {
    if (score < 1 || score > 5) throw new BadRequestException('Rating must be 1-5');

    // Check if rating exists to Update, otherwise Create
    let rating = await this.ratingsRepository.findOne({
      where: { user: { id: userId }, store: { id: storeId } }
    });

    if (rating) {
      rating.rating = score;
    } else {
      rating = this.ratingsRepository.create({
        user: { id: userId },
        store: { id: storeId },
        rating: score,
      });
    }

    await this.ratingsRepository.save(rating);
    
    // Recalculate Store Average
    await this.calculateStoreAverage(storeId);
    
    return { message: 'Rating submitted successfully' };
  }

  private async calculateStoreAverage(storeId: number) {
    const ratings = await this.ratingsRepository.find({ where: { store: { id: storeId } } });
    const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    const average = sum / ratings.length;
    
    await this.storesService.updateAverageRating(storeId, average);
  }
}