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
exports.QuotesRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let QuotesRepository = class QuotesRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data, servicesData, tx) {
        const prismaClient = tx || this.prisma;
        const quote = await prismaClient.quote.create({
            data,
        });
        if (servicesData && servicesData.length > 0) {
            const mappedServices = servicesData.map((s) => ({
                ...s,
                quoteId: quote.id,
            }));
            await prismaClient.quoteService.createMany({
                data: mappedServices,
            });
        }
        return prismaClient.quote.findUnique({
            where: { id: quote.id },
            include: {
                client: true,
                services: {
                    include: {
                        service: true,
                    },
                },
            },
        });
    }
    async findMaxQuoteNumber(companyId) {
        return this.prisma.quote.findFirst({
            where: { companyId },
            orderBy: { number: 'desc' },
        });
    }
    async findManyWithCount(where, skip, take) {
        return this.prisma.$transaction([
            this.prisma.quote.findMany({
                where,
                skip,
                take,
                orderBy: { number: 'desc' },
                include: {
                    client: {
                        select: {
                            id: true,
                            name: true,
                            phone: true,
                            whatsapp: true,
                            email: true,
                        },
                    },
                    services: {
                        include: {
                            service: {
                                select: {
                                    name: true,
                                    category: true,
                                },
                            },
                        },
                    },
                },
            }),
            this.prisma.quote.count({ where }),
        ]);
    }
    async findById(id, companyId, tx) {
        const prismaClient = tx || this.prisma;
        const where = { id, deletedAt: null };
        if (companyId) {
            where.companyId = companyId;
        }
        return prismaClient.quote.findFirst({
            where,
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        cnpj: true,
                    },
                },
                client: true,
                services: {
                    include: {
                        service: true,
                    },
                },
            },
        });
    }
    async update(id, data, servicesData, tx) {
        const prismaClient = tx || this.prisma;
        if (servicesData) {
            await prismaClient.quoteService.deleteMany({
                where: { quoteId: id },
            });
            if (servicesData.length > 0) {
                await prismaClient.quoteService.createMany({
                    data: servicesData.map((s) => ({ ...s, quoteId: id })),
                });
            }
        }
        await prismaClient.quote.update({
            where: { id },
            data,
        });
        return prismaClient.quote.findUnique({
            where: { id },
            include: {
                client: true,
                services: {
                    include: {
                        service: true,
                    },
                },
            },
        });
    }
    async executeTransaction(fn) {
        return this.prisma.$transaction(fn);
    }
};
exports.QuotesRepository = QuotesRepository;
exports.QuotesRepository = QuotesRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuotesRepository);
//# sourceMappingURL=quotes.repository.js.map