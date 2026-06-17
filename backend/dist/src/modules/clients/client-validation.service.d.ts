import { ClientsRepository } from './clients.repository';
export declare class ClientValidationService {
    private readonly repo;
    constructor(repo: ClientsRepository);
    validateUniqueCpf(cpf: string, companyId: string, excludeClientId?: string): Promise<void>;
    ensureClientExists(clientId: string, companyId: string): Promise<{
        name: string;
        id: string;
        companyId: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        cpf: string | null;
        phone: string;
        whatsapp: string | null;
        email: string | null;
        address: string | null;
        cep: string | null;
        city: string | null;
        leadSource: string | null;
        notes: string | null;
        lat: number | null;
        lng: number | null;
    }>;
}
