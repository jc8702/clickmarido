import { QuoteServiceItemDto, QuoteMaterialItemDto } from './create-quote.dto';
export declare class UpdateQuoteDto {
    clientId?: string;
    discount?: number;
    travelFee?: number;
    materials?: QuoteMaterialItemDto[];
    status?: string;
    services?: QuoteServiceItemDto[];
    signature?: string;
}
