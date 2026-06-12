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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var EvolutionApiProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvolutionApiProvider = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const config_1 = require("@nestjs/config");
let EvolutionApiProvider = EvolutionApiProvider_1 = class EvolutionApiProvider {
    configService;
    api;
    logger = new common_1.Logger(EvolutionApiProvider_1.name);
    constructor(configService) {
        this.configService = configService;
        const baseURL = this.configService.get('EVOLUTION_API_URL') || 'http://localhost:8080';
        const globalApiKey = this.configService.get('EVOLUTION_API_KEY') || '1234567890';
        this.api = axios_1.default.create({
            baseURL,
            headers: {
                apikey: globalApiKey,
                'Content-Type': 'application/json',
            },
        });
    }
    async createInstance(instanceName, webhookUrl) {
        try {
            const response = await this.api.post('/instance/create', {
                instanceName,
                qrcode: true,
                integration: 'WHATSAPP-BAILEYS',
                webhook_webhookUrl: webhookUrl,
                webhook_webhookByEvents: false,
                webhook_events: [
                    'QRCODE_UPDATED',
                    'MESSAGES_UPSERT',
                    'CONNECTION_UPDATE'
                ],
            });
            return response.data;
        }
        catch (error) {
            this.logger.error(`Error creating instance ${instanceName}: ${error.message}`);
            throw error;
        }
    }
    async fetchInstances() {
        try {
            const response = await this.api.get('/instance/fetchInstances');
            return response.data;
        }
        catch (error) {
            this.logger.error(`Error fetching instances: ${error.message}`);
            return [];
        }
    }
    async sendText(instanceName, number, text) {
        try {
            const response = await this.api.post(`/message/sendText/${instanceName}`, {
                number,
                options: { delay: 1200, presence: 'composing' },
                textMessage: { text },
            });
            return response.data;
        }
        catch (error) {
            this.logger.error(`Error sending text: ${error.message}`);
            throw error;
        }
    }
    async sendMedia(instanceName, number, mediaMessage) {
        try {
            const response = await this.api.post(`/message/sendMedia/${instanceName}`, {
                number,
                options: { delay: 1200, presence: 'composing' },
                mediaMessage,
            });
            return response.data;
        }
        catch (error) {
            this.logger.error(`Error sending media: ${error.message}`);
            throw error;
        }
    }
    async deleteInstance(instanceName) {
        try {
            const response = await this.api.delete(`/instance/delete/${instanceName}`);
            return response.data;
        }
        catch (error) {
            this.logger.error(`Error deleting instance ${instanceName}: ${error.message}`);
            throw error;
        }
    }
    async connectInstance(instanceName) {
        try {
            const response = await this.api.get(`/instance/connect/${instanceName}`);
            return response.data;
        }
        catch (error) {
            this.logger.error(`Error getting connect status for ${instanceName}: ${error.message}`);
            throw error;
        }
    }
};
exports.EvolutionApiProvider = EvolutionApiProvider;
exports.EvolutionApiProvider = EvolutionApiProvider = EvolutionApiProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EvolutionApiProvider);
//# sourceMappingURL=evolution-api.provider.js.map