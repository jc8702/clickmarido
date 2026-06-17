import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/create-appointment.dto';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    create(createDto: CreateAppointmentDto): Promise<{
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
            } | null;
            technician: {
                name: string;
                id: string;
            } | null;
            serviceOrder: {
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
            } | null;
        } & {
            id: string;
            description: string | null;
            companyId: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            clientId: string | null;
            title: string;
            technicianId: string | null;
            serviceOrderId: string | null;
            startTime: Date;
            endTime: Date;
        };
    }>;
    findAll(startDate?: string, endDate?: string, technicianId?: string, clientId?: string): Promise<{
        success: boolean;
        data: ({
            client: {
                name: string;
                id: string;
                phone: string;
                whatsapp: string | null;
            } | null;
            technician: {
                name: string;
                id: string;
            } | null;
            serviceOrder: {
                number: number;
                id: string;
                status: string;
            } | null;
        } & {
            id: string;
            description: string | null;
            companyId: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            clientId: string | null;
            title: string;
            technicianId: string | null;
            serviceOrderId: string | null;
            startTime: Date;
            endTime: Date;
        })[];
    }>;
    findOne(id: string): Promise<{
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
            } | null;
            technician: {
                name: string;
                id: string;
            } | null;
            serviceOrder: {
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
            } | null;
        } & {
            id: string;
            description: string | null;
            companyId: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            clientId: string | null;
            title: string;
            technicianId: string | null;
            serviceOrderId: string | null;
            startTime: Date;
            endTime: Date;
        };
    }>;
    update(id: string, updateDto: UpdateAppointmentDto): Promise<{
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
            } | null;
            technician: {
                name: string;
                id: string;
            } | null;
            serviceOrder: {
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
            } | null;
        } & {
            id: string;
            description: string | null;
            companyId: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            clientId: string | null;
            title: string;
            technicianId: string | null;
            serviceOrderId: string | null;
            startTime: Date;
            endTime: Date;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        data: {
            id: string;
        };
    }>;
}
