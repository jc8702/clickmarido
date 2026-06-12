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
exports.TechniciansService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let TechniciansService = class TechniciansService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createTechnicianDto) {
        return this.prisma.technician.create({
            data: createTechnicianDto,
        });
    }
    async findAll(companyId) {
        return this.prisma.technician.findMany({
            where: { companyId, deletedAt: null },
            orderBy: { name: 'asc' },
        });
    }
    async findOne(id) {
        const technician = await this.prisma.technician.findUnique({
            where: { id },
            include: {
                appointments: { where: { deletedAt: null } },
                serviceOrders: { where: { deletedAt: null } },
            },
        });
        if (!technician)
            throw new common_1.NotFoundException('Technician not found');
        return technician;
    }
    async getRanking(companyId) {
        const technicians = await this.prisma.technician.findMany({
            where: { companyId, deletedAt: null, status: 'Ativo' },
            include: {
                _count: {
                    select: {
                        serviceOrders: {
                            where: { status: 'Concluído', deletedAt: null },
                        },
                        appointments: {
                            where: { deletedAt: null },
                        },
                    },
                },
            },
        });
        const sorted = technicians.sort((a, b) => {
            if (b._count.serviceOrders !== a._count.serviceOrders) {
                return b._count.serviceOrders - a._count.serviceOrders;
            }
            return b.rating - a.rating;
        });
        return sorted;
    }
    async update(id, updateTechnicianDto) {
        await this.findOne(id);
        return this.prisma.technician.update({
            where: { id },
            data: updateTechnicianDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.technician.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
};
exports.TechniciansService = TechniciansService;
exports.TechniciansService = TechniciansService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TechniciansService);
//# sourceMappingURL=technicians.service.js.map