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
exports.ClientsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const geolocation_service_1 = require("../../core/geolocation/geolocation.service");
let ClientsService = class ClientsService {
    prisma;
    geolocationService;
    constructor(prisma, geolocationService) {
        this.prisma = prisma;
        this.geolocationService = geolocationService;
    }
    async create(createClientDto, companyId, userId) {
        const { name, cpf, phone, whatsapp, email, address, cep, city, leadSource, notes } = createClientDto;
        if (cpf) {
            const existingCpf = await this.prisma.client.findFirst({
                where: { cpf, companyId, deletedAt: null },
            });
            if (existingCpf) {
                throw new common_1.BadRequestException('Já existe um cliente cadastrado com este CPF nesta empresa.');
            }
        }
        let userName = 'Sistema';
        if (userId) {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            if (user)
                userName = user.name;
        }
        const client = await this.prisma.$transaction(async (tx) => {
            let lat = null;
            let lng = null;
            if (address) {
                const coords = await this.geolocationService.geocodeAddress(address, city);
                if (coords) {
                    lat = coords.lat;
                    lng = coords.lng;
                }
            }
            const createdClient = await tx.client.create({
                data: {
                    name,
                    cpf,
                    phone,
                    whatsapp,
                    email,
                    address,
                    cep,
                    city,
                    leadSource,
                    notes,
                    companyId,
                    lat,
                    lng,
                },
            });
            await tx.clientHistory.create({
                data: {
                    clientId: createdClient.id,
                    type: 'SYSTEM',
                    description: `Cliente cadastrado por ${userName}`,
                    createdById: userId || null,
                },
            });
            return createdClient;
        });
        return {
            success: true,
            data: client,
        };
    }
    async findAll(companyId, page = 1, limit = 10, search, leadSource, city) {
        const skip = (page - 1) * limit;
        const where = {
            companyId,
            deletedAt: null,
        };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { cpf: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (leadSource) {
            where.leadSource = { equals: leadSource, mode: 'insensitive' };
        }
        if (city) {
            where.city = { contains: city, mode: 'insensitive' };
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.client.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.client.count({ where }),
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
        const client = await this.prisma.client.findFirst({
            where: { id, companyId, deletedAt: null },
        });
        if (!client) {
            throw new common_1.NotFoundException('Cliente não encontrado ou excluído.');
        }
        return {
            success: true,
            data: client,
        };
    }
    async update(id, updateClientDto, companyId, userId) {
        const client = await this.prisma.client.findFirst({
            where: { id, companyId, deletedAt: null },
        });
        if (!client) {
            throw new common_1.NotFoundException('Cliente não encontrado.');
        }
        if (updateClientDto.cpf && updateClientDto.cpf !== client.cpf) {
            const existingCpf = await this.prisma.client.findFirst({
                where: { cpf: updateClientDto.cpf, companyId, deletedAt: null },
            });
            if (existingCpf) {
                throw new common_1.BadRequestException('Já existe outro cliente cadastrado com este CPF nesta empresa.');
            }
        }
        let userName = 'Sistema';
        if (userId) {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            if (user)
                userName = user.name;
        }
        const updatedClient = await this.prisma.$transaction(async (tx) => {
            let lat = client.lat;
            let lng = client.lng;
            if (updateClientDto.address && updateClientDto.address !== client.address) {
                const coords = await this.geolocationService.geocodeAddress(updateClientDto.address, updateClientDto.city || client.city || undefined);
                if (coords) {
                    lat = coords.lat;
                    lng = coords.lng;
                }
            }
            const dataToUpdate = { ...updateClientDto, lat, lng };
            const dbClient = await tx.client.update({
                where: { id },
                data: dataToUpdate,
            });
            await tx.clientHistory.create({
                data: {
                    clientId: id,
                    type: 'SYSTEM',
                    description: `Cadastro atualizado por ${userName}`,
                    createdById: userId || null,
                },
            });
            return dbClient;
        });
        return {
            success: true,
            data: updatedClient,
        };
    }
    async remove(id, companyId, userId) {
        const client = await this.prisma.client.findFirst({
            where: { id, companyId, deletedAt: null },
        });
        if (!client) {
            throw new common_1.NotFoundException('Cliente não encontrado.');
        }
        let userName = 'Sistema';
        if (userId) {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            if (user)
                userName = user.name;
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.client.update({
                where: { id },
                data: {
                    deletedAt: new Date(),
                },
            });
            await tx.clientHistory.create({
                data: {
                    clientId: id,
                    type: 'SYSTEM',
                    description: `Cliente arquivado (soft-delete) por ${userName}`,
                    createdById: userId || null,
                },
            });
        });
        return {
            success: true,
            data: { id },
        };
    }
    async findHistory(clientId, companyId) {
        const client = await this.prisma.client.findFirst({
            where: { id: clientId, companyId, deletedAt: null },
        });
        if (!client) {
            throw new common_1.NotFoundException('Cliente não encontrado.');
        }
        const history = await this.prisma.clientHistory.findMany({
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
        return {
            success: true,
            data: history,
        };
    }
    async createHistory(clientId, createHistoryDto, companyId, userId) {
        const { type, description } = createHistoryDto;
        const client = await this.prisma.client.findFirst({
            where: { id: clientId, companyId, deletedAt: null },
        });
        if (!client) {
            throw new common_1.NotFoundException('Cliente não encontrado.');
        }
        const interaction = await this.prisma.clientHistory.create({
            data: {
                clientId,
                type,
                description,
                createdById: userId || null,
            },
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
        return {
            success: true,
            data: interaction,
        };
    }
};
exports.ClientsService = ClientsService;
exports.ClientsService = ClientsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        geolocation_service_1.GeolocationService])
], ClientsService);
//# sourceMappingURL=clients.service.js.map