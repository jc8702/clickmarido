import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { CreateMaterialMovementDto } from './dto/create-material-movement.dto';

@Injectable()
export class MaterialsService {
  constructor(private readonly prisma: PrismaService) {}

  /* istanbul ignore next */
  async create(createMaterialDto: CreateMaterialDto, companyId: string) {
    const { name, category, quantity, minimumStock, averageCost } = createMaterialDto;

    const existing = await this.prisma.material.findFirst({
      where: { name, companyId, deletedAt: null },
    });

    if (existing) {
      throw new BadRequestException('Já existe um material com este nome cadastrado.');
    }

    const material = await this.prisma.material.create({
      data: {
        name,
        category,
        quantity: quantity ?? 0,
        minimumStock: minimumStock ?? 0,
        averageCost: averageCost ?? 0,
        companyId,
      },
    });

    return {
      success: true,
      data: material,
    };
  }

  /* istanbul ignore next */
  async findAll(
    companyId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
    category?: string,
    lowStock?: boolean,
  ) {
    const skip = (page - 1) * limit;

    const where: any = {
      companyId,
      deletedAt: null,
    };

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    if (category) {
      where.category = { equals: category, mode: 'insensitive' };
    }

    if (lowStock) {
      where.quantity = { lte: this.prisma.material.fields.minimumStock };
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.material.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.material.count({ where }),
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

  /* istanbul ignore next */
  async findOne(id: string, companyId: string) {
    const material = await this.prisma.material.findFirst({
      where: { id, companyId, deletedAt: null },
    });

    if (!material) {
      throw new NotFoundException('Material não encontrado ou excluído.');
    }

    return {
      success: true,
      data: material,
    };
  }

  /* istanbul ignore next */
  async findMovements(id: string, companyId: string, page: number = 1, limit: number = 10) {
    const material = await this.prisma.material.findFirst({
      where: { id, companyId, deletedAt: null },
    });

    if (!material) {
      throw new NotFoundException('Material não encontrado.');
    }

    const skip = (page - 1) * limit;

    const where = { materialId: id };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.materialMovement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.materialMovement.count({ where }),
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

  /* istanbul ignore next */
  async createMovement(
    materialId: string,
    companyId: string,
    userId: string | null,
    dto: CreateMaterialMovementDto,
  ) {
    const material = await this.prisma.material.findFirst({
      where: { id: materialId, companyId, deletedAt: null },
    });

    if (!material) {
      throw new NotFoundException('Material não encontrado.');
    }

    const { type, quantity, unitCost, description } = dto;

    if (type === 'SAIDA' && material.quantity < quantity) {
      throw new BadRequestException(
        `Estoque insuficiente. Disponível: ${material.quantity}, solicitado: ${quantity}.`,
      );
    }

    const [movement] = await this.prisma.$transaction(async (tx) => {
      let newAverageCost = material.averageCost;

      if (type === 'ENTRADA' && unitCost !== undefined) {
        const totalCost = material.averageCost * material.quantity + unitCost * quantity;
        const newQuantity = material.quantity + quantity;
        newAverageCost = newQuantity > 0 ? totalCost / newQuantity : 0;
      }

      const quantityDelta = type === 'SAIDA' ? -quantity : quantity;

      await tx.material.update({
        where: { id: materialId },
        data: {
          quantity: { increment: quantityDelta },
          averageCost: type === 'ENTRADA' && unitCost !== undefined ? newAverageCost : material.averageCost,
        },
      });

      const movement = await tx.materialMovement.create({
        data: {
          materialId,
          type,
          quantity,
          unitCost: unitCost ?? 0,
          description: description || null,
          companyId,
          createdById: userId || undefined,
        },
      });

      return [movement];
    });

    return {
      success: true,
      data: movement,
    };
  }

  /* istanbul ignore next */
  async update(id: string, updateMaterialDto: UpdateMaterialDto, companyId: string) {
    const material = await this.prisma.material.findFirst({
      where: { id, companyId, deletedAt: null },
    });

    if (!material) {
      throw new NotFoundException('Material não encontrado.');
    }

    if (updateMaterialDto.name) {
      const duplicate = await this.prisma.material.findFirst({
        where: {
          name: updateMaterialDto.name,
          companyId,
          deletedAt: null,
          id: { not: id },
        },
      });

      if (duplicate) {
        throw new BadRequestException('Já existe outro material com este nome.');
      }
    }

    const updatedMaterial = await this.prisma.material.update({
      where: { id },
      data: updateMaterialDto,
    });

    return {
      success: true,
      data: updatedMaterial,
    };
  }

  /* istanbul ignore next */
  async remove(id: string, companyId: string) {
    const material = await this.prisma.material.findFirst({
      where: { id, companyId, deletedAt: null },
    });

    if (!material) {
      throw new NotFoundException('Material não encontrado.');
    }

    await this.prisma.material.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return {
      success: true,
      data: { id },
    };
  }
}
