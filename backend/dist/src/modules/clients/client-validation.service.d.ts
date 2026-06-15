import { ClientsRepository } from './clients.repository';
export declare class ClientValidationService {
    private readonly repo;
    constructor(repo: ClientsRepository);
    validateUniqueCpf(cpf: string, companyId: string, excludeClientId?: string): Promise<void>;
    ensureClientExists(clientId: string, companyId: string): Promise<{
        name: string;
        id: string;
        email: string | null;
        deletedAt: Date | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        address: string | null;
        city: string | null;
        cpf: string | null;
        whatsapp: string | null;
        cep: string | null;
        leadSource: string | null;
        notes: string | null;
        lat: number | null;
        lng: number | null;
    }>;
}
