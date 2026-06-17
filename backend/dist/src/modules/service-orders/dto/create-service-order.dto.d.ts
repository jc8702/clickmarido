declare class ServiceDto {
    name: string;
    quantity: number;
    value: number;
}
declare class MaterialDto {
    materialId?: string;
    description: string;
    quantity: number;
    unitValue: number;
}
export declare class CreateServiceOrderDto {
    companyId: string;
    clientId: string;
    technicianId?: string;
    quoteId?: string;
    scheduledAt?: string;
    totalValue?: number;
    status?: string;
    observations?: string;
    services?: ServiceDto[];
    materials?: MaterialDto[];
}
export {};
