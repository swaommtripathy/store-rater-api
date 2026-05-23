import { Controller, Post, Get, Body, UseGuards, Request, Param } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ratings')
@UseGuards(JwtAuthGuard)
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  /**
   * Submit or update a rating for a store
   */
  @Post()
  submitRating(@Request() req, @Body() body: { storeId: number; rating: number }) {
    return this.ratingsService.createOrUpdate(req.user.id, body.storeId, body.rating);
  }

  /**
   * Get all ratings for a specific store
   */
  @Get('store/:storeId')
  async getRatingsForStore(@Param('storeId') storeId: string) {
    return this.ratingsService.getRatingsForStore(+storeId);
  }
}