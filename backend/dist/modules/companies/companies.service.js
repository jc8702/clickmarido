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
exports.CompaniesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let CompaniesService = class CompaniesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCompanyDto) {
        const { name, slug, cnpj, phone, email, address, city, state, active } = createCompanyDto;
        const existingSlug = await this.prisma.company.findUnique({
            where: { slug },
        });
        if (existingSlug && !existingSlug.deletedAt) {
            throw new common_1.BadRequestException('Já existe uma empresa cadastrada com este slug.');
        }
        if (cnpj) {
            const existingCnpj = await this.prisma.company.findUnique({
                where: { cnpj },
            });
            if (existingCnpj && !existingCnpj.deletedAt) {
                throw new common_1.BadRequestException('Já existe uma empresa cadastrada com este CNPJ.');
            }
        }
        const company = await this.prisma.company.create({
            data: {
                name,
                slug,
                cnpj,
                phone,
                email,
                address,
                city,
                state,
                active: active ?? true,
            },
        });
        return {
            success: true,
            data: company,
        };
    }
    async findAll(page = 1, limit = 10, search, active, state) {
        const skip = (page - 1) * limit;
        const where = {
            deletedAt: null,
        };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { cnpj: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (active !== undefined) {
            where.active = active;
        }
        if (state) {
            where.state = { equals: state, mode: 'insensitive' };
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.company.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.company.count({ where }),
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
    async findOne(id) {
        const company = await this.prisma.company.findFirst({
            where: { id, deletedAt: null },
        });
        if (!company) {
            throw new common_1.NotFoundException('Empresa não encontrada ou excluída.');
        }
        return {
            success: true,
            data: company,
        };
    }
    async update(id, updateCompanyDto) {
        const company = await this.prisma.company.findFirst({
            where: { id, deletedAt: null },
        });
        if (!company) {
            throw new common_1.NotFoundException('Empresa não encontrada.');
        }
        if (updateCompanyDto.slug && updateCompanyDto.slug !== company.slug) {
            const existingSlug = await this.prisma.company.findUnique({
                where: { slug: updateCompanyDto.slug },
            });
            if (existingSlug && !existingSlug.deletedAt) {
                throw new common_1.BadRequestException('Já existe uma empresa com este slug.');
            }
        }
        if (updateCompanyDto.cnpj && updateCompanyDto.cnpj !== company.cnpj) {
            const existingCnpj = await this.prisma.company.findUnique({
                where: { cnpj: updateCompanyDto.cnpj },
            });
            if (existingCnpj && !existingCnpj.deletedAt) {
                throw new common_1.BadRequestException('Já existe uma empresa com este CNPJ.');
            }
        }
        const updatedCompany = await this.prisma.company.update({
            where: { id },
            data: updateCompanyDto,
        });
        return {
            success: true,
            data: updatedCompany,
        };
    }
    async remove(id) {
        const company = await this.prisma.company.findFirst({
            where: { id, deletedAt: null },
        });
        if (!company) {
            throw new common_1.NotFoundException('Empresa não encontrada.');
        }
        await this.prisma.$transaction([
            this.prisma.company.update({
                where: { id },
                data: {
                    deletedAt: new Date(),
                    active: false,
                },
            }),
            this.prisma.user.updateMany({
                where: { companyId: id, deletedAt: null },
                data: {
                    deletedAt: new Date(),
                    isActive: false,
                },
            }),
            this.prisma.session.deleteMany({
                where: {
                    user: {
                        companyId: id,
                    },
                },
            }),
        ]);
        return {
            success: true,
            data: { id },
        };
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompaniesService);
//# sourceMappingURL=companies.service.js.map