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
exports.AppointmentsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let AppointmentsRepository = class AppointmentsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findClient(clientId, companyId) {
        return this.prisma.client.findFirst({
            where: { id: clientId, companyId, deletedAt: null },
        });
    }
    async findServiceOrder(serviceOrderId, companyId) {
        return this.prisma.serviceOrder.findFirst({
            where: { id: serviceOrderId, companyId, deletedAt: null },
        });
    }
    async findTechnician(technicianId, companyId) {
        return this.prisma.technician.findFirst({
            where: { id: technicianId, companyId, status: 'Ativo', deletedAt: null },
        });
    }
    async findConflictingAppointment(companyId, technicianId, start, end, excludeId) {
        const where = {
            companyId,
            technicianId,
            deletedAt: null,
            startTime: { lt: end },
            endTime: { gt: start },
        };
        if (excludeId) {
            where.id = { not: excludeId };
        }
        return this.prisma.appointment.findFirst({
            where,
            include: {
                technician: { select: { name: true } },
            },
        });
    }
    async create(data) {
        return this.prisma.appointment.create({
            data,
            include: {
                client: true,
                technician: { select: { id: true, name: true } },
                serviceOrder: true,
            },
        });
    }
    async findMany(filters) {
        const where = {
            companyId: filters.companyId,
            deletedAt: null,
        };
        if (filters.technicianId)
            where.technicianId = filters.technicianId;
        if (filters.clientId)
            where.clientId = filters.clientId;
        if (filters.startDate || filters.endDate) {
            const andFilters = [];
            if (filters.startDate)
                andFilters.push({ endTime: { gte: new Date(filters.startDate) } });
            if (filters.endDate)
                andFilters.push({ startTime: { lte: new Date(filters.endDate) } });
            where.AND = andFilters;
        }
        return this.prisma.appointment.findMany({
            where,
            orderBy: { startTime: 'asc' },
            include: {
                client: {
                    select: { id: true, name: true, phone: true, whatsapp: true },
                },
                technician: { select: { id: true, name: true } },
                serviceOrder: { select: { id: true, number: true, status: true } },
            },
        });
    }
    async findByIdAndCompany(id, companyId) {
        return this.prisma.appointment.findFirst({
            where: { id, companyId, deletedAt: null },
            include: {
                client: true,
                technician: { select: { id: true, name: true } },
                serviceOrder: true,
            },
        });
    }
    async update(id, data) {
        return this.prisma.appointment.update({
            where: { id },
            data,
            include: {
                client: true,
                technician: { select: { id: true, name: true } },
                serviceOrder: true,
            },
        });
    }
};
exports.AppointmentsRepository = AppointmentsRepository;
exports.AppointmentsRepository = AppointmentsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppointmentsRepository);
//# sourceMappingURL=appointments.repository.js.map