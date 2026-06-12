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
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let AppointmentsService = class AppointmentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDto, companyId) {
        const { title, description, startTime, endTime, clientId, technicianId, serviceOrderId, force } = createDto;
        const start = new Date(startTime);
        const end = new Date(endTime);
        if (start >= end) {
            throw new common_1.BadRequestException('A data de início deve ser anterior à data de término.');
        }
        if (clientId) {
            const client = await this.prisma.client.findFirst({
                where: { id: clientId, companyId, deletedAt: null },
            });
            if (!client) {
                throw new common_1.NotFoundException('Cliente não encontrado.');
            }
        }
        if (serviceOrderId) {
            const os = await this.prisma.serviceOrder.findFirst({
                where: { id: serviceOrderId, companyId, deletedAt: null },
            });
            if (!os) {
                throw new common_1.NotFoundException('Ordem de serviço não encontrada.');
            }
        }
        if (technicianId) {
            const tech = await this.prisma.technician.findFirst({
                where: { id: technicianId, companyId, status: 'Ativo', deletedAt: null },
            });
            if (!tech) {
                throw new common_1.NotFoundException('Técnico não encontrado ou inativo.');
            }
            if (!force) {
                const conflicting = await this.prisma.appointment.findFirst({
                    where: {
                        companyId,
                        technicianId,
                        deletedAt: null,
                        startTime: { lt: end },
                        endTime: { gt: start },
                    },
                    include: {
                        technician: {
                            select: { name: true },
                        },
                    },
                });
                if (conflicting) {
                    return {
                        success: false,
                        conflict: true,
                        message: `O técnico ${conflicting.technician?.name} possui um conflito com o compromisso "${conflicting.title}" neste período.`,
                        data: conflicting,
                    };
                }
            }
        }
        const appointment = await this.prisma.appointment.create({
            data: {
                companyId,
                title,
                description,
                startTime: start,
                endTime: end,
                clientId: clientId || null,
                technicianId: technicianId || null,
                serviceOrderId: serviceOrderId || null,
            },
            include: {
                client: true,
                technician: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                serviceOrder: true,
            },
        });
        return {
            success: true,
            data: appointment,
        };
    }
    async findAll(companyId, startDate, endDate, technicianId, clientId) {
        const where = {
            companyId,
            deletedAt: null,
        };
        if (technicianId) {
            where.technicianId = technicianId;
        }
        if (clientId) {
            where.clientId = clientId;
        }
        if (startDate || endDate) {
            where.AND = [];
            if (startDate) {
                where.AND.push({
                    endTime: { gte: new Date(startDate) },
                });
            }
            if (endDate) {
                where.AND.push({
                    startTime: { lte: new Date(endDate) },
                });
            }
        }
        const appointments = await this.prisma.appointment.findMany({
            where,
            orderBy: { startTime: 'asc' },
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        whatsapp: true,
                    },
                },
                technician: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                serviceOrder: {
                    select: {
                        id: true,
                        number: true,
                        status: true,
                    },
                },
            },
        });
        return {
            success: true,
            data: appointments,
        };
    }
    async findOne(id, companyId) {
        const appointment = await this.prisma.appointment.findFirst({
            where: { id, companyId, deletedAt: null },
            include: {
                client: true,
                technician: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                serviceOrder: true,
            },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Agendamento não encontrado.');
        }
        return {
            success: true,
            data: appointment,
        };
    }
    async update(id, updateDto, companyId) {
        const existing = await this.prisma.appointment.findFirst({
            where: { id, companyId, deletedAt: null },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Agendamento não encontrado.');
        }
        const { title, description, startTime, endTime, clientId, technicianId, serviceOrderId, force } = updateDto;
        const start = startTime ? new Date(startTime) : existing.startTime;
        const end = endTime ? new Date(endTime) : existing.endTime;
        if (start >= end) {
            throw new common_1.BadRequestException('A data de início deve ser anterior à data de término.');
        }
        if (clientId && clientId !== existing.clientId) {
            const client = await this.prisma.client.findFirst({
                where: { id: clientId, companyId, deletedAt: null },
            });
            if (!client) {
                throw new common_1.NotFoundException('Cliente não encontrado.');
            }
        }
        if (serviceOrderId && serviceOrderId !== existing.serviceOrderId) {
            const os = await this.prisma.serviceOrder.findFirst({
                where: { id: serviceOrderId, companyId, deletedAt: null },
            });
            if (!os) {
                throw new common_1.NotFoundException('Ordem de serviço não encontrada.');
            }
        }
        if (technicianId) {
            if (technicianId !== existing.technicianId || startTime || endTime) {
                const tech = await this.prisma.technician.findFirst({
                    where: { id: technicianId, companyId, status: 'Ativo', deletedAt: null },
                });
                if (!tech) {
                    throw new common_1.NotFoundException('Técnico não encontrado ou inativo.');
                }
                if (!force) {
                    const conflicting = await this.prisma.appointment.findFirst({
                        where: {
                            companyId,
                            technicianId,
                            deletedAt: null,
                            id: { not: id },
                            startTime: { lt: end },
                            endTime: { gt: start },
                        },
                        include: {
                            technician: {
                                select: { name: true },
                            },
                        },
                    });
                    if (conflicting) {
                        return {
                            success: false,
                            conflict: true,
                            message: `O técnico ${conflicting.technician?.name} possui um conflito com o compromisso "${conflicting.title}" neste período.`,
                            data: conflicting,
                        };
                    }
                }
            }
        }
        const updated = await this.prisma.appointment.update({
            where: { id },
            data: {
                title: title !== undefined ? title : existing.title,
                description: description !== undefined ? description : existing.description,
                startTime: start,
                endTime: end,
                clientId: clientId !== undefined ? clientId : existing.clientId,
                technicianId: technicianId !== undefined ? technicianId : existing.technicianId,
                serviceOrderId: serviceOrderId !== undefined ? serviceOrderId : existing.serviceOrderId,
            },
            include: {
                client: true,
                technician: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                serviceOrder: true,
            },
        });
        return {
            success: true,
            data: updated,
        };
    }
    async remove(id, companyId) {
        const existing = await this.prisma.appointment.findFirst({
            where: { id, companyId, deletedAt: null },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Agendamento não encontrado.');
        }
        await this.prisma.appointment.update({
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
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map