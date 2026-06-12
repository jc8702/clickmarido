import { ConfigService } from '@nestjs/config';
export declare class AiService {
    private configService;
    private ai;
    private flashModel;
    private jsonModel;
    constructor(configService: ConfigService);
    summarizeConversation(messages: string[]): Promise<{
        summary: string;
    }>;
    generateQuote(requestText: string): Promise<any>;
    classifyTicket(description: string): Promise<any>;
    suggestUpsell(currentServices: string[]): Promise<any>;
    suggestCrossSell(currentServices: string[]): Promise<any>;
}
