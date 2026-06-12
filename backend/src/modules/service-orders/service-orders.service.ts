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

  async findAll(companyId: string) {
    return this.prisma.serviceOrder.findMany({
      where: { companyId, deletedAt: null },
      include: {
        client: true,
        technician: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const os = await this.prisma.serviceOrder.findUnique({
      where: { id },
      include: {
        client: true,
        technician: true,
        services: true,
        materials: true,
        photos: true,
        checklists: true,
      },
    });
    if (!os) throw new NotFoundException('Service order not found');
    return os;
  }

  async generateFromQuote(quoteId: string) {
    const quote = await this.prisma.quote.findUnique({
      where: { id: quoteId },
      include: { services: { include: { service: true } } },
    });

    if (!quote) throw new NotFoundException('Quote not found');
    if (quote.status !== 'Aprovado') throw new BadRequestException('Quote must be Approved to generate an OS');

    const lastOs = await this.prisma.serviceOrder.findFirst({
      where: { companyId: quote.companyId },
      orderBy: { number: 'desc' },
    });
    const nextNumber = lastOs ? lastOs.number + 1 : 1;

    // Convert services from quote to OS
    const services = quote.services.map(qs => ({
      name: qs.service.name,
      quantity: qs.quantity,
      value: qs.value,
    }));

    // Convert materials JSON if exists
    let materials: any[] = [];
    if (quote.materials && Array.isArray(quote.materials)) {
      materials = quote.materials.map((m: any) => ({
        description: m.description,
        quantity: m.quantity,
        unitValue: m.value,
      }));
    }

    return this.prisma.serviceOrder.create({
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
  }

  async update(id: string, dto: UpdateServiceOrderDto) {
    await this.findOne(id);
    const { services, materials, ...rest } = dto;
    
    const updateData: any = { ...rest };
    if (rest.scheduledAt) {
      updateData.scheduledAt = new Date(rest.scheduledAt);
    }
    
    return this.prisma.serviceOrder.update({
      where: { id },
      data: updateData,
    });
  }

  async updateStatus(id: string, status: string) {
    // Validar status permitidos
    const validStatuses = ['Pendente', 'Agendado', 'Em Andamento', 'Aguardando Peça', 'Concluído', 'Cancelado'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Status inválido');
    }

    return this.prisma.serviceOrder.update({
      where: { id },
      data: { status },
    });
  }

  async finishOrder(id: string, signatureBase64: string) {
    return this.prisma.serviceOrder.update({
      where: { id },
      data: {
        status: 'Concluído',
        signature: signatureBase64,
      },
    });
  }

  async addPhoto(id: string, url: string, type: 'antes' | 'depois') {
    return this.prisma.serviceOrderPhoto.create({
      data: {
        serviceOrderId: id,
        url,
        type,
      },
    });
  }

  async toggleChecklist(id: string, checklistId: string, checked: boolean) {
    return this.prisma.serviceOrderChecklist.update({
      where: { id: checklistId },
      data: { checked },
    });
  }

  async addChecklistItem(id: string, item: string) {
    return this.prisma.serviceOrderChecklist.create({
      data: {
        serviceOrderId: id,
        item,
      },
    });
  }
}
