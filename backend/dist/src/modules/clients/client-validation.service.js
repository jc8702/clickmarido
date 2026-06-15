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
exports.ClientValidationService = void 0;
const common_1 = require("@nestjs/common");
const clients_repository_1 = require("./clients.repository");
let ClientValidationService = class ClientValidationService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async validateUniqueCpf(cpf, companyId, excludeClientId) {
        if (!cpf)
            return;
        const existingClient = await this.repo.findByCpfAndCompany(cpf, companyId);
        if (existingClient && existingClient.id !== excludeClientId) {
            throw new common_1.BadRequestException('Já existe um cliente cadastrado com este CPF nesta empresa.');
        }
    }
    async ensureClientExists(clientId, companyId) {
        const client = await this.repo.findByIdAndCompany(clientId, companyId);
        if (!client) {
            throw new common_1.NotFoundException('Cliente não encontrado ou excluído.');
        }
        return client;
    }
};
exports.ClientValidationService = ClientValidationService;
exports.ClientValidationService = ClientValidationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [clients_repository_1.ClientsRepository])
], ClientValidationService);
//# sourceMappingURL=client-validation.service.js.map