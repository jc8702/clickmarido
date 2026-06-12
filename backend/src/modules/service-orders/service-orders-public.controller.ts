import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { ServiceOrdersService } from './service-orders.service';

@Controller('public/service-orders')
export class ServiceOrdersPublicController {
  constructor(private readonly serviceOrdersService: ServiceOrdersService) {}

  @Get(':id')
  findPublicOrder(@Param('id') id: string) {
    return this.serviceOrdersService.findPublicOrder(id);
  }

  @Post(':id/rate')
  saveClientRating(
    @Param('id') id: string,
    @Body('rating') rating: number,
    @Body('review') review?: string,
  ) {
    if (!rating || rating < 1 || rating > 5) {
      throw new BadRequestException('A avaliação deve ser entre 1 e 5 estrelas.');
    }
    return this.serviceOrdersService.saveClientRating(id, rating, review);
  }
}
