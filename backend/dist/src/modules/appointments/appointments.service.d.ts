import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/create-appointment.dto';
export declare class AppointmentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createDto: CreateAppointmentDto, companyId: string): Promise<{
        success: boolean;
        conflict: boolean;
        message: string;
        data: {
            technician: {
                name: string;
            } | null;
        } & {
            id: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            companyId: string;
            clientId: string | null;
            technicianId: string | null;
            title: string;
            startTime: Date;
            endTime: Date;
            serviceOrderId: string | null;
        };
    } | {
        success: boolean;
        data: {
            client: {
                id: string;
                name: string;
                phone: string;
                email: string | null;
                address: string | null;
                city: string | null;
                deletedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                companyId: string;
                cpf: string | null;
                whatsapp: string | null;
                cep: string | null;
                leadSource: string | null;
                notes: string | null;
            } | null;
            technician: {
                id: string;
                name: string;
            } | null;
            serviceOrder: {
                number: number;
                id: string;
                deletedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                companyId: string;
                clientId: string;
                status: string;
                signature: string | null;
                totalValue: number;
                quoteId: string | null;
                technicianId: string | null;
                scheduledAt: Date | null;
                observations: string | null;
            } | null;
        } & {
            id: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            companyId: string;
            clientId: string | null;
            technicianId: string | null;
            title: string;
            startTime: Date;
            endTime: Date;
            serviceOrderId: string | null;
        };
        conflict?: undefined;
        message?: undefined;
    }>;
    findAll(companyId: string, startDate?: string, endDate?: string, technicianId?: string, clientId?: string): Promise<{
        success: boolean;
        data: ({
            client: {
                id: string;
                name: string;
                phone: string;
                whatsapp: string | null;
            } | null;
            technician: {
                id: string;
                name: string;
            } | null;
            serviceOrder: {
                number: number;
                id: string;
                status: string;
            } | null;
        } & {
            id: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            companyId: string;
            clientId: string | null;
            technicianId: string | null;
            title: string;
            startTime: Date;
            endTime: Date;
            serviceOrderId: string | null;
        })[];
    }>;
    findOne(id: string, companyId: string): Promise<{
        success: boolean;
        data: {
            client: {
                id: string;
                name: string;
                phone: string;
                email: string | null;
                address: string | null;
                city: string | null;
                deletedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                companyId: string;
                cpf: string | null;
                whatsapp: string | null;
                cep: string | null;
                leadSource: string | null;
                notes: string | null;
            } | null;
            technician: {
                id: string;
                name: string;
            } | null;
            serviceOrder: {
                number: number;
                id: string;
                deletedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                companyId: string;
                clientId: string;
                status: string;
                signature: string | null;
                totalValue: number;
                quoteId: string | null;
                technicianId: string | null;
                scheduledAt: Date | null;
                observations: string | null;
            } | null;
        } & {
            id: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            companyId: string;
            clientId: string | null;
            technicianId: string | null;
            title: string;
            startTime: Date;
            endTime: Date;
            serviceOrderId: string | null;
        };
    }>;
    update(id: string, updateDto: UpdateAppointmentDto, companyId: string): Promise<{
        success: boolean;
        conflict: boolean;
        message: string;
        data: {
            technician: {
                name: string;
            } | null;
        } & {
            id: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            companyId: string;
            clientId: string | null;
            technicianId: string | null;
            title: string;
            startTime: Date;
            endTime: Date;
            serviceOrderId: string | null;
        };
    } | {
        success: boolean;
        data: {
            client: {
                id: string;
                name: string;
                phone: string;
                email: string | null;
                address: string | null;
                city: string | null;
                deletedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                companyId: string;
                cpf: string | null;
                whatsapp: string | null;
                cep: string | null;
                leadSource: string | null;
                notes: string | null;
            } | null;
            technician: {
                id: string;
                name: string;
            } | null;
            serviceOrder: {
                number: number;
                id: string;
                deletedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                companyId: string;
                clientId: string;
                status: string;
                signature: string | null;
                totalValue: number;
                quoteId: string | null;
                technicianId: string | null;
                scheduledAt: Date | null;
                observations: string | null;
            } | null;
        } & {
            id: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            companyId: string;
            clientId: string | null;
            technicianId: string | null;
            title: string;
            startTime: Date;
            endTime: Date;
            serviceOrderId: string | null;
        };
        conflict?: undefined;
        message?: undefined;
    }>;
    remove(id: string, companyId: string): Promise<{
        success: boolean;
        data: {
            id: string;
        };
    }>;
}
