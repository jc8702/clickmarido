"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserDto, companyId) {
        const { email, name, password, roleIds, isActive } = createUserDto;
        if (!companyId) {
            throw new common_1.BadRequestException('A empresa (companyId) deve ser informada.');
        }
        const company = await this.prisma.company.findFirst({
            where: { id: companyId, deletedAt: null },
        });
        if (!company) {
            throw new common_1.BadRequestException('Empresa não encontrada ou inativa.');
        }
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser && !existingUser.deletedAt) {
            throw new common_1.BadRequestException('Já existe um usuário cadastrado com este e-mail.');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                companyId,
                isActive: isActive ?? true,
                roles: {
                    connect: roleIds.map((id) => ({ id })),
                },
            },
            select: {
                id: true,
                email: true,
                name: true,
                isActive: true,
                companyId: true,
                createdAt: true,
                roles: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                    },
                },
            },
        });
        return {
            success: true,
            data: user,
        };
    }
    async findAll(companyId, page = 1, limit = 10, search, roleId, active) {
        const skip = (page - 1) * limit;
        const where = {
            deletedAt: null,
        };
        if (companyId) {
            where.companyId = companyId;
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (active !== undefined) {
            where.isActive = active;
        }
        if (roleId) {
            where.roles = {
                some: {
                    id: roleId,
                },
            };
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    isActive: true,
                    companyId: true,
                    createdAt: true,
                    roles: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count({ where }),
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
        const where = { id, deletedAt: null };
        if (companyId) {
            where.companyId = companyId;
        }
        const user = await this.prisma.user.findFirst({
            where,
            select: {
                id: true,
                email: true,
                name: true,
                isActive: true,
                companyId: true,
                createdAt: true,
                roles: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado ou excluído.');
        }
        return {
            success: true,
            data: user,
        };
    }
    async update(id, updateUserDto, companyId) {
        const where = { id, deletedAt: null };
        if (companyId) {
            where.companyId = companyId;
        }
        const user = await this.prisma.user.findFirst({ where });
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado.');
        }
        const updateData = { ...updateUserDto };
        delete updateData.roleIds;
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: updateUserDto.email },
            });
            if (existingUser && !existingUser.deletedAt) {
                throw new common_1.BadRequestException('E-mail já cadastrado por outro usuário.');
            }
        }
        if (updateUserDto.password) {
            updateData.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        if (updateUserDto.roleIds) {
            updateData.roles = {
                set: updateUserDto.roleIds.map((id) => ({ id })),
            };
        }
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                email: true,
                name: true,
                isActive: true,
                companyId: true,
                createdAt: true,
                roles: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                    },
                },
            },
        });
        return {
            success: true,
            data: updatedUser,
        };
    }
    async remove(id, companyId) {
        const where = { id, deletedAt: null };
        if (companyId) {
            where.companyId = companyId;
        }
        const user = await this.prisma.user.findFirst({ where });
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado.');
        }
        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id },
                data: {
                    deletedAt: new Date(),
                    isActive: false,
                },
            }),
            this.prisma.session.deleteMany({
                where: { userId: id },
            }),
        ]);
        return {
            success: true,
            data: { id },
        };
    }
    async getRoles(companyId) {
        const roles = await this.prisma.role.findMany({
            where: { companyId },
            select: {
                id: true,
                name: true,
                description: true,
            },
        });
        return {
            success: true,
            data: roles,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map