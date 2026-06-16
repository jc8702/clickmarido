import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  private ai: GoogleGenerativeAI;
  private flashModel: GenerativeModel;
  private jsonModel: GenerativeModel;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set. AI features will fail.');
    }
    this.ai = new GoogleGenerativeAI(apiKey || 'dummy');

    // Modelo com instruções de sistema voltadas para a vertical
    const systemInstruction =
      'Você é um Assistente Técnico e Comercial especialista em manutenção predial, residencial e reparos (marido de aluguel). Responda sempre em pt-BR, sendo direto, pragmático e focando em maximizar o lucro, eficiência e a satisfação do cliente.';

    this.flashModel = this.ai.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction,
    });

    // Para saídas restritas e analíticas em JSON
    this.jsonModel = this.ai.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction,
      generationConfig: { responseMimeType: 'application/json' },
    });
  }

  /* istanbul ignore next */
  async summarizeConversation(messages: string[]) {
    try {
      const prompt = `Analise as seguintes mensagens trocadas com o cliente e retorne APENAS um resumo do problema e qual a intenção dele (compra rápida, pechincha, suporte a garantia, etc).\n\nMensagens:\n${messages.join('\n')}`;
      const result = await this.flashModel.generateContent(prompt);
      return { summary: result.response.text() };
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(
        'Falha ao comunicar com Google Gemini',
      );
    }
  }

  /* istanbul ignore next */
  async generateQuote(requestText: string) {
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
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(
        'Falha ao comunicar com Google Gemini',
      );
    }
  }

  /* istanbul ignore next */
  async classifyTicket(description: string) {
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
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(
        'Falha ao comunicar com Google Gemini',
      );
    }
  }

  /* istanbul ignore next */
  async suggestUpsell(currentServices: string[]) {
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
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(
        'Falha ao comunicar com Google Gemini',
      );
    }
  }

  /* istanbul ignore next */
  async suggestCrossSell(currentServices: string[]) {
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
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(
        'Falha ao comunicar com Google Gemini',
      );
    }
  }
}
