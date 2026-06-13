import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateServiceOrderDto } from './dto/create-service-order.dto';
import { UpdateServiceOrderDto } from './dto/update-service-order.dto';

@Injectable()
export class ServiceOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateServiceOrderDto) {
    const { services, materials, ...rest } = dto;
    
    // Obter o proximo numero sequencial de OS para essa empresa
    const lastOs = await this.prisma.serviceOrder.findFirst({
      where: { companyId: rest.companyId },
      orderBy: { number: 'desc' },
    });
    const nextNumber = lastOs ? lastOs.number + 1 : 1;

    return this.prisma.serviceOrder.create({
      data: {
        ...rest,
        number: nextNumber,
        scheduledAt: rest.scheduledAt ? new Date(rest.scheduledAt) : undefined,
        services: {
          create: services || [],
        },
        materials: {
          create: materials || [],
        },
      },
      include: {
        services: true,
        materials: true,
      },
    });
  }

  async findAll(
    companyId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: string,
  ) {
    const skip = (page - 1) * limit;

    const where: any = {
      companyId,
      deletedAt: null,
    };

    if (status) {
      where.status = status;
    }

    if (search) {
      const searchNum = parseInt(search, 10);
      if (!isNaN(searchNum)) {
        where.number = searchNum;
      } else {
        where.client = {
          name: { contains: search, mode: 'insensitive' },
        };
      }
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.serviceOrder.findMany({
        where,
        skip,
        take: limit,
        orderBy: { number: 'desc' },
        include: {
          client: true,
          technician: true,
          services: true,
          materials: true,
          photos: true,
          checklists: true,
        },
      }),
      this.prisma.serviceOrder.count({ where }),
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
    const os = await this.prisma.serviceOrder.findFirst({
      where: { id, companyId, deletedAt: null },
      include: {
        client: true,
        technician: true,
        services: true,
        materials: true,
        photos: true,
        checklists: true,
      },
    });
    if (!os) throw new NotFoundException('Ordem de serviço não encontrada.');
    return { success: true, data: os };
  }

  async generateFromQuote(quoteId: string) {
    const quote = await this.prisma.quote.findUnique({
      where: { id: quoteId },
      include: { services: { include: { service: true } } },
    });

    if (!quote) throw new NotFoundException('Orçamento não encontrado.');
    if (quote.status !== 'Aprovado') throw new BadRequestException('Orçamento precisa estar aprovado para gerar uma OS.');

    const lastOs = await this.prisma.serviceOrder.findFirst({
      where: { companyId: quote.companyId },
      orderBy: { number: 'desc' },
    });
    const nextNumber = lastOs ? lastOs.number + 1 : 1;

    const services = quote.services.map(qs => ({
      name: qs.service.name,
      quantity: qs.quantity,
      value: qs.value,
    }));

    let materials: any[] = [];
    if (quote.materials && Array.isArray(quote.materials)) {
      materials = quote.materials.map((m: any) => ({
        description: m.description,
        quantity: m.quantity,
        unitValue: m.value,
      }));
    }

    const os = await this.prisma.serviceOrder.create({
      data: {
        number: nextNumber,
        companyId: quote.companyId,
        clientId: quote.clientId,
        quoteId: quote.id,
        totalValue: quote.totalValue,
        services: { create: services },
        materials: { create: materials },
      },
    });

    return { success: true, data: os };
  }

  async update(id: string, dto: UpdateServiceOrderDto, companyId: string) {
    const existing = await this.prisma.serviceOrder.findFirst({
      where: { id, companyId, deletedAt: null },
    });
    if (!existing) throw new NotFoundException('Ordem de serviço não encontrada.');

    const { services, materials, ...rest } = dto;
    
    const updateData: any = { ...rest };
    if (rest.scheduledAt) {
      updateData.scheduledAt = new Date(rest.scheduledAt);
    }
    
    const updated = await this.prisma.serviceOrder.update({
      where: { id },
      data: updateData,
    });

    return { success: true, data: updated };
  }

  async updateStatus(id: string, status: string, companyId: string) {
    const existing = await this.prisma.serviceOrder.findFirst({
      where: { id, companyId, deletedAt: null },
    });
    if (!existing) throw new NotFoundException('Ordem de serviço não encontrada.');

    const validStatuses = ['Pendente', 'Agendado', 'Em Andamento', 'Aguardando Peça', 'Concluído', 'Cancelado'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Status inválido.');
    }

    const updated = await this.prisma.serviceOrder.update({
      where: { id },
      data: { status },
    });

    return { success: true, data: updated };
  }

  async finishOrder(id: string, signatureBase64: string, companyId: string) {
    const existing = await this.prisma.serviceOrder.findFirst({
      where: { id, companyId, deletedAt: null },
    });
    if (!existing) throw new NotFoundException('Ordem de serviço não encontrada.');

    const updated = await this.prisma.serviceOrder.update({
      where: { id },
      data: {
        status: 'Concluído',
        signature: signatureBase64,
      },
    });

    return { success: true, data: updated };
  }

  async addPhoto(id: string, url: string, type: 'antes' | 'depois', companyId: string) {
    const existing = await this.prisma.serviceOrder.findFirst({
      where: { id, companyId, deletedAt: null },
    });
    if (!existing) throw new NotFoundException('Ordem de serviço não encontrada.');

    const photo = await this.prisma.serviceOrderPhoto.create({
      data: {
        serviceOrderId: id,
        url,
        type,
      },
    });

    return { success: true, data: photo };
  }

  async toggleChecklist(id: string, checklistId: string, checked: boolean, companyId: string) {
    const existing = await this.prisma.serviceOrder.findFirst({
      where: { id, companyId, deletedAt: null },
    });
    if (!existing) throw new NotFoundException('Ordem de serviço não encontrada.');

    const updated = await this.prisma.serviceOrderChecklist.update({
      where: { id: checklistId },
      data: { checked },
    });

    return { success: true, data: updated };
  }

  async addChecklistItem(id: string, item: string, companyId: string) {
    const existing = await this.prisma.serviceOrder.findFirst({
      where: { id, companyId, deletedAt: null },
    });
    if (!existing) throw new NotFoundException('Ordem de serviço não encontrada.');

    const checklist = await this.prisma.serviceOrderChecklist.create({
      data: {
        serviceOrderId: id,
        item,
      },
    });

    return { success: true, data: checklist };
  }

  async findPublicOrder(id: string) {
    const os = await this.prisma.serviceOrder.findUnique({
      where: { id },
      include: {
        company: { select: { name: true, phone: true } },
        technician: { select: { name: true, phone: true } },
      },
    });
    if (!os) throw new NotFoundException('Ordem de serviço não encontrada');
    return os;
  }

  async saveClientRating(id: string, rating: number, review?: string) {
    const os = await this.prisma.serviceOrder.findUnique({
      where: { id },
    });
    if (!os) throw new NotFoundException('Ordem de serviço não encontrada.');

    // Salva na OS
    await this.prisma.serviceOrder.update({
      where: { id },
      data: { clientRating: rating, clientReview: review },
    });

    // Atualiza media do tecnico
    if (os.technicianId) {
      const allOrders = await this.prisma.serviceOrder.findMany({
        where: { technicianId: os.technicianId, clientRating: { not: null } },
      });
      const validOrders = allOrders.filter(o => o.clientRating !== null);
      if (validOrders.length > 0) {
        const total = validOrders.reduce((sum, o) => sum + (o.clientRating || 0), 0);
        const avg = total / validOrders.length;
        await this.prisma.technician.update({
          where: { id: os.technicianId },
          data: { rating: avg },
        });
      }
    }

    return { success: true };
  }
}
