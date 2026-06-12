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
    async findAll(companyId) {
        return this.prisma.serviceOrder.findMany({
            where: { companyId, deletedAt: null },
            include: {
                client: true,
                technician: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
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
        if (!os)
            throw new common_1.NotFoundException('Service order not found');
        return os;
    }
    async generateFromQuote(quoteId) {
        const quote = await this.prisma.quote.findUnique({
            where: { id: quoteId },
            include: { services: { include: { service: true } } },
        });
        if (!quote)
            throw new common_1.NotFoundException('Quote not found');
        if (quote.status !== 'Aprovado')
            throw new common_1.BadRequestException('Quote must be Approved to generate an OS');
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
    async update(id, dto) {
        await this.findOne(id);
        const { services, materials, ...rest } = dto;
        const updateData = { ...rest };
        if (rest.scheduledAt) {
            updateData.scheduledAt = new Date(rest.scheduledAt);
        }
        return this.prisma.serviceOrder.update({
            where: { id },
            data: updateData,
        });
    }
    async updateStatus(id, status) {
        const validStatuses = ['Pendente', 'Agendado', 'Em Andamento', 'Aguardando Peça', 'Concluído', 'Cancelado'];
        if (!validStatuses.includes(status)) {
            throw new common_1.BadRequestException('Status inválido');
        }
        return this.prisma.serviceOrder.update({
            where: { id },
            data: { status },
        });
    }
    async finishOrder(id, signatureBase64) {
        return this.prisma.serviceOrder.update({
            where: { id },
            data: {
                status: 'Concluído',
                signature: signatureBase64,
            },
        });
    }
    async addPhoto(id, url, type) {
        return this.prisma.serviceOrderPhoto.create({
            data: {
                serviceOrderId: id,
                url,
                type,
            },
        });
    }
    async toggleChecklist(id, checklistId, checked) {
        return this.prisma.serviceOrderChecklist.update({
            where: { id: checklistId },
            data: { checked },
        });
    }
    async addChecklistItem(id, item) {
        return this.prisma.serviceOrderChecklist.create({
            data: {
                serviceOrderId: id,
                item,
            },
        });
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
        const os = await this.findOne(id);
        if (!os)
            throw new common_1.NotFoundException('OS não encontrada');
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