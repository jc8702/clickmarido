import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { ServiceOrdersService } from './service-orders.service';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@Controller('public/service-orders')
@ApiTags('Service-orders-public')
@ApiBearerAuth('JWT-auth')
export class ServiceOrdersPublicController {
  constructor(private readonly serviceOrdersService: ServiceOrdersService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Operation findPublicOrder' })
  @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  findPublicOrder(@Param('id') id: string) {
    return this.serviceOrdersService.findPublicOrder(id);
  }

  @Post(':id/rate')
  @ApiOperation({ summary: 'Operation saveClientRating' })
  @ApiCreatedResponse({
    description: 'Service-orders-public criado com sucesso.',
  })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  saveClientRating(
    @Param('id') id: string,
    @Body('rating') rating: number,
    @Body('review') review?: string,
  ) {
    if (!rating || rating < 1 || rating > 5) {
      throw new BadRequestException(
        'A avaliação deve ser entre 1 e 5 estrelas.',
      );
    }
    return this.serviceOrdersService.saveClientRating(id, rating, review);
  }
}
