export declare class QuoteServiceItemDto {
    serviceId: string;
    quantity: number;
    value: number;
}
export declare class QuoteMaterialItemDto {
    description: string;
    quantity: number;
    value: number;
}
export declare class CreateQuoteDto {
    clientId: string;
    discount?: number;
    travelFee?: number;
    materials?: QuoteMaterialItemDto[];
    status?: string;
    services: QuoteServiceItemDto[];
}
