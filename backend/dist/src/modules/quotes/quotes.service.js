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
exports.QuotesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const quotes_repository_1 = require("./quotes.repository");
let QuotesService = class QuotesService {
    prisma;
    quotesRepository;
    constructor(prisma, quotesRepository) {
        this.prisma = prisma;
        this.quotesRepository = quotesRepository;
    }
    async create(createQuoteDto, companyId) {
        const { clientId, discount = 0, travelFee = 0, materials = [], status = 'Rascunho', services, } = createQuoteDto;
        const client = await this.prisma.client.findFirst({
            where: { id: clientId, companyId, deletedAt: null },
        });
        if (!client) {
            throw new common_1.NotFoundException('Cliente não encontrado.');
        }
        const maxQuote = await this.quotesRepository.findMaxQuoteNumber(companyId);
        const quoteNumber = maxQuote ? maxQuote.number + 1 : 1;
        let servicesTotal = 0;
        for (const item of services) {
            const dbService = await this.prisma.service.findFirst({
                where: { id: item.serviceId, companyId, deletedAt: null },
            });
            if (!dbService) {
                throw new common_1.NotFoundException(`Serviço com ID ${item.serviceId} não encontrado no catálogo.`);
            }
            servicesTotal += item.quantity * item.value;
        }
        const materialsTotal = materials.reduce((sum, m) => sum + m.quantity * m.value, 0);
        const rawTotal = servicesTotal + materialsTotal + travelFee - discount;
        const totalValue = Math.max(0, rawTotal);
        const quote = await this.quotesRepository.executeTransaction(async (tx) => {
            const data = {
                number: quoteNumber,
                company: { connect: { id: companyId } },
                client: { connect: { id: clientId } },
                discount,
                travelFee,
                materials: materials,
                totalValue,
                status,
            };
            const servicesData = services.map((s) => ({
                quoteId: `quote-${Date.now()}`,
                serviceId: s.serviceId,
                quantity: s.quantity,
                value: s.value,
            }));
            return this.quotesRepository.create(data, servicesData, tx);
        });
        return {
            success: true,
            data: quote,
        };
    }
    async findAll(companyId, page = 1, limit = 10, search, status, clientId) {
        const skip = (page - 1) * limit;
        const where = {
            companyId,
            deletedAt: null,
        };
        if (status) {
            where.status = status;
        }
        if (clientId) {
            where.clientId = clientId;
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
        const [items, total] = await this.quotesRepository.findManyWithCount(where, skip, limit);
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
        const quote = await this.quotesRepository.findById(id, companyId);
        if (!quote) {
            throw new common_1.NotFoundException('Orçamento não encontrado.');
        }
        return {
            success: true,
            data: quote,
        };
    }
    async findPublicQuote(id) {
        const quote = await this.quotesRepository.findById(id);
        if (!quote) {
            throw new common_1.NotFoundException('Orçamento não encontrado ou link expirado.');
        }
        return {
            success: true,
            data: quote,
        };
    }
    async update(id, updateQuoteDto, companyId) {
        const existingQuote = await this.quotesRepository.findById(id, companyId);
        if (!existingQuote) {
            throw new common_1.NotFoundException('Orçamento não encontrado.');
        }
        const { clientId, discount, travelFee, materials, status, services, signature, } = updateQuoteDto;
        if (clientId && clientId !== existingQuote.clientId) {
            const client = await this.prisma.client.findFirst({
                where: { id: clientId, companyId, deletedAt: null },
            });
            if (!client) {
                throw new common_1.NotFoundException('Novo cliente não encontrado.');
            }
        }
        const updatedQuote = await this.quotesRepository.executeTransaction(async (tx) => {
            let activeServices = existingQuote.services.map((s) => ({
                serviceId: s.serviceId,
                quantity: s.quantity,
                value: s.value,
            }));
            let servicesDataToUpdate = undefined;
            if (services) {
                servicesDataToUpdate = services.map((s) => ({
                    serviceId: s.serviceId,
                    quantity: s.quantity,
                    value: s.value,
                }));
                activeServices = servicesDataToUpdate;
            }
            let servicesTotal = 0;
            for (const item of activeServices) {
                servicesTotal += item.quantity * item.value;
            }
            const activeMaterials = materials !== undefined
                ? materials
                : existingQuote.materials ||
                    [];
            const materialsTotal = activeMaterials.reduce((sum, m) => sum + m.quantity * m.value, 0);
            const activeDiscount = discount !== undefined ? discount : existingQuote.discount;
            const activeTravelFee = travelFee !== undefined ? travelFee : existingQuote.travelFee;
            const rawTotal = servicesTotal + materialsTotal + activeTravelFee - activeDiscount;
            const totalValue = Math.max(0, rawTotal);
            const updateData = {
                totalValue,
            };
            if (clientId !== undefined)
                updateData.client = { connect: { id: clientId } };
            if (discount !== undefined)
                updateData.discount = discount;
            if (travelFee !== undefined)
                updateData.travelFee = travelFee;
            if (materials !== undefined)
                updateData.materials = materials;
            if (status !== undefined)
                updateData.status = status;
            if (signature !== undefined) {
                updateData.signature = signature;
                updateData.signedAt = new Date();
                updateData.status = 'Aprovado';
            }
            return this.quotesRepository.update(id, updateData, servicesDataToUpdate, tx);
        });
        return {
            success: true,
            data: updatedQuote,
        };
    }
    async saveSignature(id, signatureBase64, companyId) {
        const existingQuote = await this.quotesRepository.findById(id, companyId);
        if (!existingQuote) {
            throw new common_1.NotFoundException('Orçamento não encontrado.');
        }
        const updatedQuote = await this.quotesRepository.update(id, {
            signature: signatureBase64,
            signedAt: new Date(),
            status: 'Aprovado',
        });
        return {
            success: true,
            data: updatedQuote,
        };
    }
    async savePublicSignature(id, signatureBase64) {
        const existingQuote = await this.quotesRepository.findById(id);
        if (!existingQuote) {
            throw new common_1.NotFoundException('Orçamento não encontrado.');
        }
        if (existingQuote.status === 'Aprovado') {
            throw new common_1.BadRequestException('Orçamento já foi aprovado anteriormente.');
        }
        const updatedQuote = await this.quotesRepository.update(id, {
            signature: signatureBase64,
            signedAt: new Date(),
            status: 'Aprovado',
        });
        return {
            success: true,
            data: { id: updatedQuote?.id, status: updatedQuote?.status },
        };
    }
    async remove(id, companyId) {
        const existingQuote = await this.quotesRepository.findById(id, companyId);
        if (!existingQuote) {
            throw new common_1.NotFoundException('Orçamento não encontrado.');
        }
        await this.quotesRepository.update(id, {
            deletedAt: new Date(),
        });
        return {
            success: true,
            data: { id },
        };
    }
};
exports.QuotesService = QuotesService;
exports.QuotesService = QuotesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        quotes_repository_1.QuotesRepository])
], QuotesService);
//# sourceMappingURL=quotes.service.js.map