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
exports.ServiceOrdersRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let ServiceOrdersRepository = class ServiceOrdersRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.serviceOrder.create({ data });
    }
    async findMany(companyId) {
        return this.prisma.serviceOrder.findMany({
            where: { companyId, deletedAt: null },
            orderBy: { createdAt: 'desc' },
            include: {
                client: { select: { id: true, name: true } },
            }
        });
    }
    async findById(id, companyId) {
        return this.prisma.serviceOrder.findFirst({
            where: { id, companyId, deletedAt: null },
            include: {
                client: true,
                appointments: true,
            }
        });
    }
    async update(id, data) {
        return this.prisma.serviceOrder.update({
            where: { id },
            data,
        });
    }
};
exports.ServiceOrdersRepository = ServiceOrdersRepository;
exports.ServiceOrdersRepository = ServiceOrdersRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServiceOrdersRepository);
//# sourceMappingURL=service-orders.repository.js.map