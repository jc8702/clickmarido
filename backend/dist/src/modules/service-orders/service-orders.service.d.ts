import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateServiceOrderDto } from './dto/create-service-order.dto';
import { UpdateServiceOrderDto } from './dto/update-service-order.dto';
export declare class ServiceOrdersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateServiceOrderDto): Promise<{
        materials: {
            id: string;
            quantity: number;
            description: string;
            materialId: string | null;
            unitValue: number;
            serviceOrderId: string;
        }[];
        services: {
            name: string;
            id: string;
            quantity: number;
            value: number;
            serviceOrderId: string;
        }[];
    } & {
        number: number;
        id: string;
        scheduledAt: Date | null;
        quoteId: string | null;
        companyId: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        totalValue: number;
        status: string;
        signature: string | null;
        technicianId: string | null;
        observations: string | null;
        clientRating: number | null;
        clientReview: string | null;
    }>;
    findAll(companyId: string, page?: number, limit?: number, search?: string, status?: string): Promise<{
        success: boolean;
        data: {
            items: ({
                client: {
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
                };
                technician: {
                    name: string;
                    id: string;
                    specialty: string | null;
                    companyId: string;
                    deletedAt: Date | null;
                    createdAt: Date;
                    updatedAt: Date;
                    status: string;
                    phone: string;
                    lat: number | null;
                    lng: number | null;
                    rating: number;
                } | null;
                materials: {
                    id: string;
                    quantity: number;
                    description: string;
                    materialId: string | null;
                    unitValue: number;
                    serviceOrderId: string;
                }[];
                services: {
                    name: string;
                    id: string;
                    quantity: number;
                    value: number;
                    serviceOrderId: string;
                }[];
                checklists: {
                    id: string;
                    serviceOrderId: string;
                    item: string;
                    checked: boolean;
                }[];
                photos: {
                    id: string;
                    createdAt: Date;
                    type: string;
                    url: string;
                    serviceOrderId: string;
                }[];
            } & {
                number: number;
                id: string;
                scheduledAt: Date | null;
                quoteId: string | null;
                companyId: string;
                deletedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                clientId: string;
                totalValue: number;
                status: string;
                signature: string | null;
                technicianId: string | null;
                observations: string | null;
                clientRating: number | null;
                clientReview: string | null;
            })[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, companyId: string): Promise<{
        success: boolean;
        data: {
            client: {
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
            };
            technician: {
                name: string;
                id: string;
                specialty: string | null;
                companyId: string;
                deletedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                status: string;
                phone: string;
                lat: number | null;
                lng: number | null;
                rating: number;
            } | null;
            materials: {
                id: string;
                quantity: number;
                description: string;
                materialId: string | null;
                unitValue: number;
                serviceOrderId: string;
            }[];
            services: {
                name: string;
                id: string;
                quantity: number;
                value: number;
                serviceOrderId: string;
            }[];
            checklists: {
                id: string;
                serviceOrderId: string;
                item: string;
                checked: boolean;
            }[];
            photos: {
                id: string;
                createdAt: Date;
                type: string;
                url: string;
                serviceOrderId: string;
            }[];
        } & {
            number: number;
            id: string;
            scheduledAt: Date | null;
            quoteId: string | null;
            companyId: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            clientId: string;
            totalValue: number;
            status: string;
            signature: string | null;
            technicianId: string | null;
            observations: string | null;
            clientRating: number | null;
            clientReview: string | null;
        };
    }>;
    generateFromQuote(quoteId: string): Promise<{
        success: boolean;
        data: {
            number: number;
            id: string;
            scheduledAt: Date | null;
            quoteId: string | null;
            companyId: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            clientId: string;
            totalValue: number;
            status: string;
            signature: string | null;
            technicianId: string | null;
            observations: string | null;
            clientRating: number | null;
            clientReview: string | null;
        };
    }>;
    update(id: string, dto: UpdateServiceOrderDto, companyId: string): Promise<{
        success: boolean;
        data: {
            number: number;
            id: string;
            scheduledAt: Date | null;
            quoteId: string | null;
            companyId: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            clientId: string;
            totalValue: number;
            status: string;
            signature: string | null;
            technicianId: string | null;
            observations: string | null;
            clientRating: number | null;
            clientReview: string | null;
        };
    }>;
    updateStatus(id: string, status: string, companyId: string): Promise<{
        success: boolean;
        data: {
            number: number;
            id: string;
            scheduledAt: Date | null;
            quoteId: string | null;
            companyId: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            clientId: string;
            totalValue: number;
            status: string;
            signature: string | null;
            technicianId: string | null;
            observations: string | null;
            clientRating: number | null;
            clientReview: string | null;
        };
    }>;
    finishOrder(id: string, signatureBase64: string, companyId: string): Promise<{
        success: boolean;
        data: {
            number: number;
            id: string;
            scheduledAt: Date | null;
            quoteId: string | null;
            companyId: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            clientId: string;
            totalValue: number;
            status: string;
            signature: string | null;
            technicianId: string | null;
            observations: string | null;
            clientRating: number | null;
            clientReview: string | null;
        };
    }>;
    addPhoto(id: string, url: string, type: 'antes' | 'depois', companyId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            type: string;
            url: string;
            serviceOrderId: string;
        };
    }>;
    toggleChecklist(id: string, checklistId: string, checked: boolean, companyId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            serviceOrderId: string;
            item: string;
            checked: boolean;
        };
    }>;
    addChecklistItem(id: string, item: string, companyId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            serviceOrderId: string;
            item: string;
            checked: boolean;
        };
    }>;
    findPublicOrder(id: string): Promise<{
        company: {
            name: string;
            phone: string | null;
        };
        technician: {
            name: string;
            phone: string;
        } | null;
    } & {
        number: number;
        id: string;
        scheduledAt: Date | null;
        quoteId: string | null;
        companyId: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        totalValue: number;
        status: string;
        signature: string | null;
        technicianId: string | null;
        observations: string | null;
        clientRating: number | null;
        clientReview: string | null;
    }>;
    saveClientRating(id: string, rating: number, review?: string): Promise<{
        success: boolean;
    }>;
}
