import { AiService } from './ai.service';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    summarize(body: {
        messages: string[];
    }): Promise<{
        summary: string;
    }>;
    generateQuote(body: {
        requestText: string;
    }): Promise<any>;
    classifyTicket(body: {
        description: string;
    }): Promise<any>;
    suggestUpsell(body: {
        currentServices: string[];
    }): Promise<any>;
    suggestCrossSell(body: {
        currentServices: string[];
    }): Promise<any>;
}
