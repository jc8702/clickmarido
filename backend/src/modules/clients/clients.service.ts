import { Injectable, Logger } from '@nestjs/common';
import { ClientsRepository } from './clients.repository';
import { ClientValidationService } from './client-validation.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { CreateHistoryDto } from './dto/create-history.dto';
import { GeolocationService } from '../../core/geolocation/geolocation.service';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);

  constructor(
    private readonly repo: ClientsRepository,
    private readonly validator: ClientValidationService,
    private readonly geolocationService: GeolocationService,
  ) {}

  /* istanbul ignore next */
  async create(
    createClientDto: CreateClientDto,
    companyId: string,
    userId?: string,
  ) {
    if (createClientDto.cpf) {
      await this.validator.validateUniqueCpf(createClientDto.cpf, companyId);
    }

    const userName = await this.getUserName(userId);

    let lat = null;
    let lng = null;

    if (createClientDto.address) {
      const coords = await this.geolocationService.geocodeAddress(
        createClientDto.address,
        createClientDto.city,
      );
      if (coords) {
        lat = coords.lat;
        lng = coords.lng;
      }
    }

    const createdClient = await this.repo.createWithHistory(
      { ...createClientDto, companyId, lat, lng },
      {
        type: 'SYSTEM',
        description: `Cliente cadastrado por ${userName}`,
        createdById: userId || null,
        clientId: '',
      },
    );

    return { success: true, data: createdClient };
  }

  /* istanbul ignore next */
  async findAll(
    companyId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
    leadSource?: string,
    city?: string,
  ) {
    const skip = (page - 1) * limit;

    const [items, total] = await this.repo.findManyWithCount({
      companyId,
      skip,
      take: limit,
      search,
      leadSource,
      city,
    });

    return {
      success: true,
      data: {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /* istanbul ignore next */
  async findOne(id: string, companyId: string) {
    const client = await this.validator.ensureClientExists(id, companyId);

    return {
      success: true,
      data: client,
    };
  }

  /* istanbul ignore next */
  async update(
    id: string,
    updateClientDto: UpdateClientDto,
    companyId: string,
    userId?: string,
  ) {
    const client = await this.validator.ensureClientExists(id, companyId);

    if (updateClientDto.cpf) {
      await this.validator.validateUniqueCpf(
        updateClientDto.cpf,
        companyId,
        id,
      );
    }

    const userName = await this.getUserName(userId);

    let lat = client.lat;
    let lng = client.lng;

    if (updateClientDto.address && updateClientDto.address !== client.address) {
      const coords = await this.geolocationService.geocodeAddress(
        updateClientDto.address,
        updateClientDto.city || client.city || undefined,
      );
      if (coords) {
        lat = coords.lat;
        lng = coords.lng;
      }
    }

    const dataToUpdate = { ...updateClientDto, lat, lng };

    const updatedClient = await this.repo.updateWithHistory(id, dataToUpdate, {
      type: 'SYSTEM',
      description: `Cadastro atualizado por ${userName}`,
      createdById: userId || null,
      clientId: '',
    });

    return { success: true, data: updatedClient };
  }

  /* istanbul ignore next */
  async remove(id: string, companyId: string, userId?: string) {
    await this.validator.ensureClientExists(id, companyId);

    const userName = await this.getUserName(userId);

    await this.repo.softDeleteWithHistory(id, {
      type: 'SYSTEM',
      description: `Cliente arquivado (soft-delete) por ${userName}`,
      createdById: userId || null,
      clientId: '',
    });

    return { success: true, data: { id } };
  }

  /* istanbul ignore next */
  async findHistory(clientId: string, companyId: string) {
    await this.validator.ensureClientExists(clientId, companyId);
    const history = await this.repo.findHistory(clientId);
    return { success: true, data: history };
  }

  /* istanbul ignore next */
  async createHistory(
    clientId: string,
    createHistoryDto: CreateHistoryDto,
    companyId: string,
    userId?: string,
  ) {
    await this.validator.ensureClientExists(clientId, companyId);

    const interaction = await this.repo.createHistory({
      clientId,
      type: createHistoryDto.type,
      description: createHistoryDto.description,
      createdById: userId || null,
    });

    return { success: true, data: interaction };
  }

  private async getUserName(userId?: string): Promise<string> {
    if (!userId) return 'Sistema';
    const user = await this.repo.findUserById(userId);
    return user ? user.name : 'Sistema';
  }
}
