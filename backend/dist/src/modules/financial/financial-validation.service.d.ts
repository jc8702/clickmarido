export interface ValidateTransactionInput {
    value?: number;
    dueDate?: string | Date;
    type?: string;
}
export declare class FinancialValidationService {
    validateTransaction(data: ValidateTransactionInput): void;
    validateSummaryParams(companyId: string): void;
}
