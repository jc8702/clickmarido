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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let ServicesService = class ServicesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createServiceDto, companyId) {
        const { category, name, description, value, averageTime, complexity, warranty, specialty, active, } = createServiceDto;
        const service = await this.prisma.service.create({
            data: {
                category,
                name,
                description,
                value,
                averageTime,
                complexity,
                warranty,
                specialty,
                active: active ?? true,
                companyId,
            },
        });
        return {
            success: true,
            data: service,
        };
    }
    async findAll(companyId, page = 1, limit = 10, search, category, complexity, active) {
        const skip = (page - 1) * limit;
        const where = {
            companyId,
            deletedAt: null,
        };
        if (search) {
            where.name = { contains: search, mode: 'insensitive' };
        }
        if (category) {
            where.category = { equals: category, mode: 'insensitive' };
        }
        if (complexity) {
            where.complexity = { equals: complexity, mode: 'insensitive' };
        }
        if (active !== undefined) {
            where.active = active;
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.service.findMany({
                where,
                skip,
                take: limit,
                orderBy: { category: 'asc' },
            }),
            this.prisma.service.count({ where }),
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
        const service = await this.prisma.service.findFirst({
            where: { id, companyId, deletedAt: null },
        });
        if (!service) {
            throw new common_1.NotFoundException('Serviço não encontrado ou excluído.');
        }
        return {
            success: true,
            data: service,
        };
    }
    async update(id, updateServiceDto, companyId) {
        const service = await this.prisma.service.findFirst({
            where: { id, companyId, deletedAt: null },
        });
        if (!service) {
            throw new common_1.NotFoundException('Serviço não encontrado.');
        }
        const updatedService = await this.prisma.service.update({
            where: { id },
            data: updateServiceDto,
        });
        return {
            success: true,
            data: updatedService,
        };
    }
    async remove(id, companyId) {
        const service = await this.prisma.service.findFirst({
            where: { id, companyId, deletedAt: null },
        });
        if (!service) {
            throw new common_1.NotFoundException('Serviço não encontrado.');
        }
        await this.prisma.service.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                active: false,
            },
        });
        return {
            success: true,
            data: { id },
        };
    }
    async exportCsv(companyId) {
        const services = await this.prisma.service.findMany({
            where: { companyId, deletedAt: null },
            orderBy: { category: 'asc' },
        });
        let csv = 'Categoria;Nome;Descrição;Valor;Tempo Médio (min);Complexidade;Garantia (dias);Especialidade;Status\n';
        for (const s of services) {
            const description = s.description
                ? s.description.replace(/[\n\r;]/g, ' ')
                : '';
            const specialty = s.specialty ? s.specialty.replace(/[\n\r;]/g, ' ') : '';
            const status = s.active ? 'Ativo' : 'Inativo';
            csv += `${s.category};${s.name};${description};${s.value};${s.averageTime};${s.complexity};${s.warranty};${specialty};${status}\n`;
        }
        return csv;
    }
    async validateCsv(csvContent, companyId) {
        if (!csvContent || csvContent.trim() === '') {
            throw new common_1.BadRequestException('Conteúdo do arquivo CSV vazio.');
        }
        const lines = csvContent
            .split(/\r?\n/)
            .filter((line) => line.trim() !== '');
        if (lines.length <= 1) {
            throw new common_1.BadRequestException('O CSV deve conter pelo menos uma linha de dados além do cabeçalho.');
        }
        const dataLines = lines.slice(1);
        const results = [];
        for (let i = 0; i < dataLines.length; i++) {
            const line = dataLines[i];
            const index = i + 2;
            const columns = line.split(/[;,]/).map((col) => col.trim());
            const errors = [];
            let isValid = true;
            if (columns.length < 4) {
                errors.push(`Estrutura inválida: a linha possui apenas ${columns.length} colunas (mínimo esperado: 4).`);
                isValid = false;
            }
            const category = columns[0] || '';
            const name = columns[1] || '';
            const description = columns[2] || '';
            const rawValue = columns[3] || '0';
            const rawTime = columns[4] || '0';
            const complexity = columns[5] || 'Média';
            const rawWarranty = columns[6] || '0';
            const specialty = columns[7] || '';
            const rawActive = columns[8] || 'Ativo';
            if (!name) {
                errors.push('O Nome do serviço é obrigatório.');
                isValid = false;
            }
            if (!category) {
                errors.push('A Categoria é obrigatória.');
                isValid = false;
            }
            else if (!['Elétrica', 'Hidráulica', 'Instalações', 'Marcenaria'].includes(category)) {
                errors.push(`Categoria inválida: '${category}' (Permitidas: Elétrica, Hidráulica, Instalações, Marcenaria).`);
                isValid = false;
            }
            const value = parseFloat(rawValue.replace(',', '.')) || 0;
            if (isNaN(value) || value <= 0) {
                errors.push(`Valor inválido: '${rawValue}' (Deve ser um número maior que zero).`);
                isValid = false;
            }
            const averageTime = parseInt(rawTime, 10) || 0;
            if (isNaN(averageTime) || averageTime <= 0) {
                errors.push(`Tempo médio inválido: '${rawTime}' (Deve ser um número inteiro de minutos maior que zero).`);
                isValid = false;
            }
            const warranty = parseInt(rawWarranty, 10) || 0;
            if (isNaN(warranty) || warranty < 0) {
                errors.push(`Garantia inválida: '${rawWarranty}' (Deve ser um número de dias maior ou igual a zero).`);
                isValid = false;
            }
            if (!['Baixa', 'Média', 'Alta'].includes(complexity)) {
                errors.push(`Complexidade inválida: '${complexity}' (Permitidas: Baixa, Média, Alta).`);
                isValid = false;
            }
            const active = rawActive === 'Inativo' ? false : true;
            let action = 'CREATE';
            if (isValid) {
                const existing = await this.prisma.service.findFirst({
                    where: { name, category, companyId, deletedAt: null },
                });
                if (existing) {
                    action = 'UPDATE';
                }
            }
            else {
                action = 'NONE';
            }
            results.push({
                index,
                isValid,
                action,
                errors,
                service: {
                    category,
                    name,
                    description: description || null,
                    value,
                    averageTime,
                    complexity,
                    warranty,
                    specialty: specialty || null,
                    active,
                },
            });
        }
        return {
            success: true,
            data: results,
        };
    }
    async confirmImport(items, companyId) {
        if (!items || !Array.isArray(items) || items.length === 0) {
            throw new common_1.BadRequestException('Nenhum item válido para importação fornecido.');
        }
        let createdCount = 0;
        let updatedCount = 0;
        let errorCount = 0;
        await this.prisma.$transaction(async (tx) => {
            for (const item of items) {
                try {
                    const { category, name, description, value, averageTime, complexity, warranty, specialty, active, } = item.service;
                    if (item.action === 'UPDATE') {
                        const existing = await tx.service.findFirst({
                            where: { name, category, companyId, deletedAt: null },
                        });
                        if (existing) {
                            await tx.service.update({
                                where: { id: existing.id },
                                data: {
                                    description,
                                    value,
                                    averageTime,
                                    complexity,
                                    warranty,
                                    specialty,
                                    active,
                                },
                            });
                            updatedCount++;
                        }
                        else {
                            await tx.service.create({
                                data: {
                                    category,
                                    name,
                                    description,
                                    value,
                                    averageTime,
                                    complexity,
                                    warranty,
                                    specialty,
                                    active,
                                    companyId,
                                },
                            });
                            createdCount++;
                        }
                    }
                    else if (item.action === 'CREATE') {
                        await tx.service.create({
                            data: {
                                category,
                                name,
                                description,
                                value,
                                averageTime,
                                complexity,
                                warranty,
                                specialty,
                                active,
                                companyId,
                            },
                        });
                        createdCount++;
                    }
                }
                catch {
                    errorCount++;
                }
            }
        });
        return {
            success: true,
            data: {
                totalProcessed: items.length,
                createdCount,
                updatedCount,
                errorCount,
            },
        };
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServicesService);
//# sourceMappingURL=services.service.js.map