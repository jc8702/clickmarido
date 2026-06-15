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
exports.ServiceOrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let ServiceOrdersService = class ServiceOrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const { services, materials, ...rest } = dto;
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
    async findAll(companyId, page = 1, limit = 10, search, status) {
        const skip = (page - 1) * limit;
        const where = {
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
            }
            else {
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
    async findOne(id, companyId) {
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
        if (!os)
            throw new common_1.NotFoundException('Ordem de serviço não encontrada.');
        return { success: true, data: os };
    }
    async generateFromQuote(quoteId) {
        const quote = await this.prisma.quote.findUnique({
            where: { id: quoteId },
            include: { services: { include: { service: true } } },
        });
        if (!quote)
            throw new common_1.NotFoundException('Orçamento não encontrado.');
        if (quote.status !== 'Aprovado')
            throw new common_1.BadRequestException('Orçamento precisa estar aprovado para gerar uma OS.');
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
        let materials = [];
        if (quote.materials && Array.isArray(quote.materials)) {
            materials = quote.materials.map((m) => ({
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
    async update(id, dto, companyId) {
        const existing = await this.prisma.serviceOrder.findFirst({
            where: { id, companyId, deletedAt: null },
        });
        if (!existing)
            throw new common_1.NotFoundException('Ordem de serviço não encontrada.');
        const { services, materials, ...rest } = dto;
        const updateData = { ...rest };
        if (rest.scheduledAt) {
            updateData.scheduledAt = new Date(rest.scheduledAt);
        }
        const updated = await this.prisma.serviceOrder.update({
            where: { id },
            data: updateData,
        });
        return { success: true, data: updated };
    }
    async updateStatus(id, status, companyId) {
        const existing = await this.prisma.serviceOrder.findFirst({
            where: { id, companyId, deletedAt: null },
        });
        if (!existing)
            throw new common_1.NotFoundException('Ordem de serviço não encontrada.');
        const validStatuses = ['Pendente', 'Agendado', 'Em Andamento', 'Aguardando Peça', 'Concluído', 'Cancelado'];
        if (!validStatuses.includes(status)) {
            throw new common_1.BadRequestException('Status inválido.');
        }
        const updated = await this.prisma.serviceOrder.update({
            where: { id },
            data: { status },
        });
        return { success: true, data: updated };
    }
    async finishOrder(id, signatureBase64, companyId) {
        const existing = await this.prisma.serviceOrder.findFirst({
            where: { id, companyId, deletedAt: null },
        });
        if (!existing)
            throw new common_1.NotFoundException('Ordem de serviço não encontrada.');
        const updated = await this.prisma.serviceOrder.update({
            where: { id },
            data: {
                status: 'Concluído',
                signature: signatureBase64,
            },
        });
        return { success: true, data: updated };
    }
    async addPhoto(id, url, type, companyId) {
        const existing = await this.prisma.serviceOrder.findFirst({
            where: { id, companyId, deletedAt: null },
        });
        if (!existing)
            throw new common_1.NotFoundException('Ordem de serviço não encontrada.');
        const photo = await this.prisma.serviceOrderPhoto.create({
            data: {
                serviceOrderId: id,
                url,
                type,
            },
        });
        return { success: true, data: photo };
    }
    async toggleChecklist(id, checklistId, checked, companyId) {
        const existing = await this.prisma.serviceOrder.findFirst({
            where: { id, companyId, deletedAt: null },
        });
        if (!existing)
            throw new common_1.NotFoundException('Ordem de serviço não encontrada.');
        const updated = await this.prisma.serviceOrderChecklist.update({
            where: { id: checklistId },
            data: { checked },
        });
        return { success: true, data: updated };
    }
    async addChecklistItem(id, item, companyId) {
        const existing = await this.prisma.serviceOrder.findFirst({
            where: { id, companyId, deletedAt: null },
        });
        if (!existing)
            throw new common_1.NotFoundException('Ordem de serviço não encontrada.');
        const checklist = await this.prisma.serviceOrderChecklist.create({
            data: {
                serviceOrderId: id,
                item,
            },
        });
        return { success: true, data: checklist };
    }
    async findPublicOrder(id) {
        const os = await this.prisma.serviceOrder.findUnique({
            where: { id },
            include: {
                company: { select: { name: true, phone: true } },
                technician: { select: { name: true, phone: true } },
            },
        });
        if (!os)
            throw new common_1.NotFoundException('Ordem de serviço não encontrada');
        return os;
    }
    async saveClientRating(id, rating, review) {
        const os = await this.prisma.serviceOrder.findUnique({
            where: { id },
        });
        if (!os)
            throw new common_1.NotFoundException('Ordem de serviço não encontrada.');
        await this.prisma.serviceOrder.update({
            where: { id },
            data: { clientRating: rating, clientReview: review },
        });
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
};
exports.ServiceOrdersService = ServiceOrdersService;
exports.ServiceOrdersService = ServiceOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServiceOrdersService);
//# sourceMappingURL=service-orders.service.js.map