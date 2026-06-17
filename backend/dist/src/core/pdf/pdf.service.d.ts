import { Quote, Client, QuoteService, Service } from '@prisma/client';
interface QuoteServiceWithDetails extends QuoteService {
    service?: Service;
}
interface QuotePdfData extends Quote {
    client?: Client;
    services?: QuoteServiceWithDetails[];
}
export declare class PdfService {
    generateQuotePdf(quoteData: QuotePdfData): Promise<Buffer>;
}
export {};
