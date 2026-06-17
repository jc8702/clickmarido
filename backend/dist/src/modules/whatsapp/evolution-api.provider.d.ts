import { ConfigService } from '@nestjs/config';
export declare class EvolutionApiProvider {
    private configService;
    private api;
    private readonly logger;
    constructor(configService: ConfigService);
    createInstance(instanceName: string, webhookUrl: string): Promise<any>;
    fetchInstances(): Promise<any>;
    sendText(instanceName: string, number: string, text: string): Promise<any>;
    sendMedia(instanceName: string, number: string, mediaMessage: {
        mediatype: string;
        mimetype: string;
        fileName?: string;
        caption?: string;
        media: string;
    }): Promise<any>;
    deleteInstance(instanceName: string): Promise<any>;
    connectInstance(instanceName: string): Promise<any>;
}
