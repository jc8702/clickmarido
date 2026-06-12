export declare class UpdateTransactionDto {
    type?: 'RECEITA' | 'DESPESA';
    category?: string;
    value?: number;
    description?: string;
    transactionDate?: string;
    dueDate?: string;
    status?: 'PENDENTE' | 'PAGO' | 'CANCELADO';
    paidAt?: string;
}
