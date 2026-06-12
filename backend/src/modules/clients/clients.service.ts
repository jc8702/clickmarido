import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { CreateHistoryDto } from './dto/create-history.dto';

import { GeolocationService } from '../../core/geolocation/geolocation.service';

@Injectable()
export class ClientsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly geolocationService: GeolocationService,
  ) {}

  async create(createClientDto: CreateClientDto, companyId: string, userId?: string) {
    const { name, cpf, phone, whatsapp, email, address, cep, city, leadSource, notes } = createClientDto;

    // Se informou CPF, valida unicidade por empresa
    if (cpf) {
      const existingCpf = await this.prisma.client.findFirst({
        where: { cpf, companyId, deletedAt: null },
      });
      if (existingCpf) {
        throw new BadRequestException('Já existe um cliente cadastrado com este CPF nesta empresa.');
      }
    }

    // Busca o usuário que está realizando o cadastro para detalhar no histórico
    let userName = 'Sistema';
    if (userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user) userName = user.name;
    }

    // Cria o cliente e o histórico inicial em uma transação
    const client = await this.prisma.$transaction(async (tx) => {
      let lat = null;
      let lng = null;

      if (address) {
        const coords = await this.geolocationService.geocodeAddress(address, city);
        if (coords) {
          lat = coords.lat;
          lng = coords.lng;
        }
      }

      const createdClient = await tx.client.create({
        data: {
          name,
          cpf,
          phone,
          whatsapp,
          email,
          address,
          cep,
          city,
          leadSource,
          notes,
          companyId,
          lat,
          lng,
        },
      });

      await tx.clientHistory.create({
        data: {
          clientId: createdClient.id,
          type: 'SYSTEM',
          description: `Cliente cadastrado por ${userName}`,
          createdById: userId || null,
        },
      });

      return createdClient;
    });

    return {
      success: true,
      data: client,
    };
  }

  async findAll(
    companyId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
    leadSource?: string,
    city?: string,
  ) {
    const skip = (page - 1) * limit;

    const where: any = {
      companyId,
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { cpf: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (leadSource) {
      where.leadSource = { equals: leadSource, mode: 'insensitive' };
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.client.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.client.count({ where }),
    ]);

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

  async findOne(id: string, companyId: string) {
    const client = await this.prisma.client.findFirst({
      where: { id, companyId, deletedAt: null },
    });

    if (!client) {
      throw new NotFoundException('Cliente não encontrado ou excluído.');
    }

    return {
      success: true,
      data: client,
    };
  }

  async update(id: string, updateClientDto: UpdateClientDto, companyId: string, userId?: string) {
    const client = await this.prisma.client.findFirst({
      where: { id, companyId, deletedAt: null },
    });

    if (!client) {
      throw new NotFoundException('Cliente não encontrado.');
    }

    // Se alterar CPF, valida unicidade por empresa
    if (updateClientDto.cpf && updateClientDto.cpf !== client.cpf) {
      const existingCpf = await this.prisma.client.findFirst({
        where: { cpf: updateClientDto.cpf, companyId, deletedAt: null },
      });
      if (existingCpf) {
        throw new BadRequestException('Já existe outro cliente cadastrado com este CPF nesta empresa.');
      }
    }

    // Busca o usuário que está editando
    let userName = 'Sistema';
    if (userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user) userName = user.name;
    }

    const updatedClient = await this.prisma.$transaction(async (tx) => {
      let lat = client.lat;
      let lng = client.lng;

      if (updateClientDto.address && updateClientDto.address !== client.address) {
        const coords = await this.geolocationService.geocodeAddress(updateClientDto.address, updateClientDto.city || client.city || undefined);
        if (coords) {
          lat = coords.lat;
          lng = coords.lng;
        }
      }

      const dataToUpdate = { ...updateClientDto, lat, lng };

      const dbClient = await tx.client.update({
        where: { id },
        data: dataToUpdate,
      });

      await tx.clientHistory.create({
        data: {
          clientId: id,
          type: 'SYSTEM',
          description: `Cadastro atualizado por ${userName}`,
          createdById: userId || null,
        },
      });

      return dbClient;
    });

    return {
      success: true,
      data: updatedClient,
    };
  }

  async remove(id: string, companyId: string, userId?: string) {
    const client = await this.prisma.client.findFirst({
      where: { id, companyId, deletedAt: null },
    });

    if (!client) {
      throw new NotFoundException('Cliente não encontrado.');
    }

    // Busca o usuário que está excluindo
    let userName = 'Sistema';
    if (userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user) userName = user.name;
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.client.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });

      await tx.clientHistory.create({
        data: {
          clientId: id,
          type: 'SYSTEM',
          description: `Cliente arquivado (soft-delete) por ${userName}`,
          createdById: userId || null,
        },
      });
    });

    return {
      success: true,
      data: { id },
    };
  }

  async findHistory(clientId: string, companyId: string) {
    // Valida se o cliente pertence à empresa
    const client = await this.prisma.client.findFirst({
      where: { id: clientId, companyId, deletedAt: null },
    });
    if (!client) {
      throw new NotFoundException('Cliente não encontrado.');
    }

    const history = await this.prisma.clientHistory.findMany({
      where: { clientId },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: history,
    };
  }

  async createHistory(clientId: string, createHistoryDto: CreateHistoryDto, companyId: string, userId?: string) {
    const { type, description } = createHistoryDto;

    // Valida se o cliente pertence à empresa
    const client = await this.prisma.client.findFirst({
      where: { id: clientId, companyId, deletedAt: null },
    });
    if (!client) {
      throw new NotFoundException('Cliente não encontrado.');
    }

    const interaction = await this.prisma.clientHistory.create({
      data: {
        clientId,
        type,
        description,
        createdById: userId || null,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return {
      success: true,
      data: interaction,
    };
  }
}
