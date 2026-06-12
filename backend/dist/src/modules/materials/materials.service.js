"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let MaterialsService = class MaterialsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createMaterialDto, companyId) {
        const { name, category, quantity, minimumStock, averageCost } = createMaterialDto;
        const existing = await this.prisma.material.findFirst({
            where: { name, companyId, deletedAt: null },
        });
        if (existing) {
            throw new common_1.BadRequestException('Já existe um material com este nome cadastrado.');
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
    async findAll(companyId, page = 1, limit = 10, search, category, lowStock) {
        const skip = (page - 1) * limit;
        const where = {
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
    async findOne(id, companyId) {
        const material = await this.prisma.material.findFirst({
            where: { id, companyId, deletedAt: null },
        });
        if (!material) {
            throw new common_1.NotFoundException('Material não encontrado ou excluído.');
        }
        return {
            success: true,
            data: material,
        };
    }
    async findMovements(id, companyId, page = 1, limit = 10) {
        const material = await this.prisma.material.findFirst({
            where: { id, companyId, deletedAt: null },
        });
        if (!material) {
            throw new common_1.NotFoundException('Material não encontrado.');
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
    async createMovement(materialId, companyId, userId, dto) {
        const material = await this.prisma.material.findFirst({
            where: { id: materialId, companyId, deletedAt: null },
        });
        if (!material) {
            throw new common_1.NotFoundException('Material não encontrado.');
        }
        const { type, quantity, unitCost, description } = dto;
        if (type === 'SAIDA' && material.quantity < quantity) {
            throw new common_1.BadRequestException(`Estoque insuficiente. Disponível: ${material.quantity}, solicitado: ${quantity}.`);
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
    async update(id, updateMaterialDto, companyId) {
        const material = await this.prisma.material.findFirst({
            where: { id, companyId, deletedAt: null },
        });
        if (!material) {
            throw new common_1.NotFoundException('Material não encontrado.');
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
                throw new common_1.BadRequestException('Já existe outro material com este nome.');
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
    async remove(id, companyId) {
        const material = await this.prisma.material.findFirst({
            where: { id, companyId, deletedAt: null },
        });
        if (!material) {
            throw new common_1.NotFoundException('Material não encontrado.');
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
};
exports.MaterialsService = MaterialsService;
exports.MaterialsService = MaterialsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MaterialsService);
//# sourceMappingURL=materials.service.js.map