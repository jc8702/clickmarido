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
exports.ClientsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let ClientsRepository = class ClientsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByCpfAndCompany(cpf, companyId) {
        return this.prisma.client.findFirst({
            where: { cpf, companyId, deletedAt: null },
        });
    }
    async findByIdAndCompany(id, companyId) {
        return this.prisma.client.findFirst({
            where: { id, companyId, deletedAt: null },
        });
    }
    async findUserById(userId) {
        return this.prisma.user.findUnique({ where: { id: userId } });
    }
    buildWhereClause(filters) {
        const where = {
            companyId: filters.companyId,
            deletedAt: null,
        };
        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { cpf: { contains: filters.search, mode: 'insensitive' } },
                { phone: { contains: filters.search, mode: 'insensitive' } },
                { email: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        if (filters.leadSource) {
            where.leadSource = { equals: filters.leadSource, mode: 'insensitive' };
        }
        if (filters.city) {
            where.city = { contains: filters.city, mode: 'insensitive' };
        }
        return where;
    }
    async findManyWithCount(filters) {
        const where = this.buildWhereClause(filters);
        return this.prisma.$transaction([
            this.prisma.client.findMany({
                where,
                skip: filters.skip,
                take: filters.take,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.client.count({ where }),
        ]);
    }
    async createWithHistory(clientData, historyData) {
        return this.prisma.$transaction(async (tx) => {
            const createdClient = await tx.client.create({
                data: clientData,
            });
            await tx.clientHistory.create({
                data: {
                    ...historyData,
                    clientId: createdClient.id,
                },
            });
            return createdClient;
        });
    }
    async updateWithHistory(clientId, dataToUpdate, historyData) {
        return this.prisma.$transaction(async (tx) => {
            const dbClient = await tx.client.update({
                where: { id: clientId },
                data: dataToUpdate,
            });
            await tx.clientHistory.create({
                data: {
                    ...historyData,
                    clientId,
                },
            });
            return dbClient;
        });
    }
    async softDeleteWithHistory(clientId, historyData) {
        return this.prisma.$transaction(async (tx) => {
            await tx.client.update({
                where: { id: clientId },
                data: {
                    deletedAt: new Date(),
                },
            });
            await tx.clientHistory.create({
                data: {
                    ...historyData,
                    clientId,
                },
            });
        });
    }
    async findHistory(clientId) {
        return this.prisma.clientHistory.findMany({
            where: { clientId },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createHistory(data) {
        return this.prisma.clientHistory.create({
            data,
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }
};
exports.ClientsRepository = ClientsRepository;
exports.ClientsRepository = ClientsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClientsRepository);
//# sourceMappingURL=clients.repository.js.map