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
exports.WarrantiesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let WarrantiesService = class WarrantiesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(companyId, data) {
        const { clientId, serviceOrderId, type, description, startDate } = data;
        let daysToAdd = 30;
        if (type === 'ELETRICA' || type === 'HIDRAULICA')
            daysToAdd = 90;
        else if (type === 'INSTALACAO')
            daysToAdd = 60;
        else if (type === 'MARCENARIA')
            daysToAdd = 30;
        const start = startDate ? new Date(startDate) : new Date();
        const endDate = new Date(start);
        endDate.setDate(endDate.getDate() + daysToAdd);
        let status = 'ACTIVE';
        if (endDate < new Date()) {
            status = 'EXPIRED';
        }
        return this.prisma.warranty.create({
            data: {
                companyId,
                clientId,
                serviceOrderId,
                type,
                description,
                startDate: start,
                endDate,
                status,
            },
        });
    }
    async findAll(companyId) {
        return this.prisma.warranty.findMany({
            where: { companyId },
            include: {
                client: { select: { name: true } },
                serviceOrder: { select: { number: true } },
            },
            orderBy: { endDate: 'asc' },
        });
    }
    async findOne(id, companyId) {
        const warranty = await this.prisma.warranty.findUnique({
            where: { id, companyId },
            include: {
                client: true,
                serviceOrder: true,
            },
        });
        if (!warranty)
            throw new common_1.NotFoundException('Garantia não encontrada');
        return warranty;
    }
    async updateStatus(id, companyId, status) {
        return this.prisma.warranty.update({
            where: { id, companyId },
            data: { status },
        });
    }
    async remove(id, companyId) {
        return this.prisma.warranty.delete({
            where: { id, companyId },
        });
    }
};
exports.WarrantiesService = WarrantiesService;
exports.WarrantiesService = WarrantiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WarrantiesService);
//# sourceMappingURL=warranties.service.js.map