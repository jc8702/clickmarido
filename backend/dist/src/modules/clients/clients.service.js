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
var ClientsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientsService = void 0;
const common_1 = require("@nestjs/common");
const clients_repository_1 = require("./clients.repository");
const client_validation_service_1 = require("./client-validation.service");
const geolocation_service_1 = require("../../core/geolocation/geolocation.service");
let ClientsService = ClientsService_1 = class ClientsService {
    repo;
    validator;
    geolocationService;
    logger = new common_1.Logger(ClientsService_1.name);
    constructor(repo, validator, geolocationService) {
        this.repo = repo;
        this.validator = validator;
        this.geolocationService = geolocationService;
    }
    async create(createClientDto, companyId, userId) {
        if (createClientDto.cpf) {
            await this.validator.validateUniqueCpf(createClientDto.cpf, companyId);
        }
        const userName = await this.getUserName(userId);
        let lat = null;
        let lng = null;
        if (createClientDto.address) {
            const coords = await this.geolocationService.geocodeAddress(createClientDto.address, createClientDto.city);
            if (coords) {
                lat = coords.lat;
                lng = coords.lng;
            }
        }
        const createdClient = await this.repo.createWithHistory({ ...createClientDto, companyId, lat, lng }, {
            type: 'SYSTEM',
            description: `Cliente cadastrado por ${userName}`,
            createdById: userId || null,
            clientId: '',
        });
        return { success: true, data: createdClient };
    }
    async findAll(companyId, page = 1, limit = 10, search, leadSource, city) {
        const skip = (page - 1) * limit;
        const [items, total] = await this.repo.findManyWithCount({
            companyId,
            skip,
            take: limit,
            search,
            leadSource,
            city,
        });
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
        const client = await this.validator.ensureClientExists(id, companyId);
        return {
            success: true,
            data: client,
        };
    }
    async update(id, updateClientDto, companyId, userId) {
        const client = await this.validator.ensureClientExists(id, companyId);
        if (updateClientDto.cpf) {
            await this.validator.validateUniqueCpf(updateClientDto.cpf, companyId, id);
        }
        const userName = await this.getUserName(userId);
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
        const updatedClient = await this.repo.updateWithHistory(id, dataToUpdate, {
            type: 'SYSTEM',
            description: `Cadastro atualizado por ${userName}`,
            createdById: userId || null,
            clientId: '',
        });
        return { success: true, data: updatedClient };
    }
    async remove(id, companyId, userId) {
        await this.validator.ensureClientExists(id, companyId);
        const userName = await this.getUserName(userId);
        await this.repo.softDeleteWithHistory(id, {
            type: 'SYSTEM',
            description: `Cliente arquivado (soft-delete) por ${userName}`,
            createdById: userId || null,
            clientId: '',
        });
        return { success: true, data: { id } };
    }
    async findHistory(clientId, companyId) {
        await this.validator.ensureClientExists(clientId, companyId);
        const history = await this.repo.findHistory(clientId);
        return { success: true, data: history };
    }
    async createHistory(clientId, createHistoryDto, companyId, userId) {
        await this.validator.ensureClientExists(clientId, companyId);
        const interaction = await this.repo.createHistory({
            clientId,
            type: createHistoryDto.type,
            description: createHistoryDto.description,
            createdById: userId || null,
        });
        return { success: true, data: interaction };
    }
    async getUserName(userId) {
        if (!userId)
            return 'Sistema';
        const user = await this.repo.findUserById(userId);
        return user ? user.name : 'Sistema';
    }
};
exports.ClientsService = ClientsService;
exports.ClientsService = ClientsService = ClientsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [clients_repository_1.ClientsRepository,
        client_validation_service_1.ClientValidationService,
        geolocation_service_1.GeolocationService])
], ClientsService);
//# sourceMappingURL=clients.service.js.map