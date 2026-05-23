import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { Rating } from './entities/rating.entity';
import { StoresModule } from '../stores/stores.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Rating]), StoresModule, UsersModule],
  controllers: [RatingsController],
  providers: [RatingsService],
})
export class RatingsModule {}