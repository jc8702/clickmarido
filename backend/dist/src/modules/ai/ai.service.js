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
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const generative_ai_1 = require("@google/generative-ai");
const config_1 = require("@nestjs/config");
let AiService = class AiService {
    configService;
    ai;
    flashModel;
    jsonModel;
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('GEMINI_API_KEY');
        if (!apiKey) {
            console.warn('GEMINI_API_KEY is not set. AI features will fail.');
        }
        this.ai = new generative_ai_1.GoogleGenerativeAI(apiKey || 'dummy');
        const systemInstruction = 'Você é um Assistente Técnico e Comercial especialista em manutenção predial, residencial e reparos (marido de aluguel). Responda sempre em pt-BR, sendo direto, pragmático e focando em maximizar o lucro, eficiência e a satisfação do cliente.';
        this.flashModel = this.ai.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction,
        });
        this.jsonModel = this.ai.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction,
            generationConfig: { responseMimeType: 'application/json' },
        });
    }
    async summarizeConversation(messages) {
        try {
            const prompt = `Analise as seguintes mensagens trocadas com o cliente e retorne APENAS um resumo do problema e qual a intenção dele (compra rápida, pechincha, suporte a garantia, etc).\n\nMensagens:\n${messages.join('\n')}`;
            const result = await this.flashModel.generateContent(prompt);
            return { summary: result.response.text() };
        }
        catch (e) {
            console.error(e);
            throw new common_1.InternalServerErrorException('Falha ao comunicar com Google Gemini');
        }
    }
    async generateQuote(requestText) {
        try {
            const prompt = `Analise a solicitação do cliente e sugira um esqueleto de orçamento.
Retorne um JSON OBRIGATÓRIO neste formato:
{
  "title": "Título sugerido para o orçamento",
  "suggestedServices": ["Serviço 1", "Serviço 2"],
  "suggestedMaterials": ["Material 1", "Material 2"],
  "estimatedHours": 2,
  "urgency": "high" // ou "medium" ou "low"
}

Solicitação do cliente: "${requestText}"`;
            const result = await this.jsonModel.generateContent(prompt);
            return JSON.parse(result.response.text());
        }
        catch (e) {
            console.error(e);
            throw new common_1.InternalServerErrorException('Falha ao comunicar com Google Gemini');
        }
    }
    async classifyTicket(description) {
        try {
            const prompt = `Classifique este chamado do cliente para sabermos qual técnico enviar.
Retorne um JSON OBRIGATÓRIO neste formato:
{
  "category": "Elétrica", // (Pode ser Elétrica, Hidráulica, Pintura, Alvenaria, Marcenaria, Ar-condicionado ou Geral)
  "severity": "Critica", // (Pode ser Baixa, Media, Alta, Critica)
  "reason": "Explicação muito breve do porquê desta classificação"
}

Chamado: "${description}"`;
            const result = await this.jsonModel.generateContent(prompt);
            return JSON.parse(result.response.text());
        }
        catch (e) {
            console.error(e);
            throw new common_1.InternalServerErrorException('Falha ao comunicar com Google Gemini');
        }
    }
    async suggestUpsell(currentServices) {
        try {
            const prompt = `O cliente está contratando atualmente os serviços: [${currentServices.join(', ')}].
Aja como vendedor. Sugira APENAS UM serviço Premium extra que seria fácil adicionar à mesma visita (Upsell da mesma categoria).
Retorne um JSON OBRIGATÓRIO neste formato:
{
  "serviceName": "Nome do serviço Premium sugerido",
  "pitch": "A fala ideal que o técnico deve dizer para convencer o cliente a aceitar"
}`;
            const result = await this.jsonModel.generateContent(prompt);
            return JSON.parse(result.response.text());
        }
        catch (e) {
            console.error(e);
            throw new common_1.InternalServerErrorException('Falha ao comunicar com Google Gemini');
        }
    }
    async suggestCrossSell(currentServices) {
        try {
            const prompt = `O cliente está contratando os serviços: [${currentServices.join(', ')}].
Aja como vendedor estratégico. Sugira APENAS UM serviço de outra categoria (Cross-sell) que faria sentido oferecer, pois reparos causam problemas adjacentes (ex: mexer em cano estraga parede).
Retorne um JSON OBRIGATÓRIO neste formato:
{
  "serviceName": "Nome do serviço adjacente sugerido",
  "pitch": "A fala ideal que mostra ao cliente que fazer isso agora previne problemas e economiza dinheiro na visita"
}`;
            const result = await this.jsonModel.generateContent(prompt);
            return JSON.parse(result.response.text());
        }
        catch (e) {
            console.error(e);
            throw new common_1.InternalServerErrorException('Falha ao comunicar com Google Gemini');
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map