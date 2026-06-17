import { PrismaService } from '../../core/prisma/prisma.service';
import { Prisma } from '@prisma/client';
export interface AppointmentFilters {
    companyId: string;
    startDate?: string;
    endDate?: string;
    technicianId?: string;
    clientId?: string;
}
export declare class AppointmentsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findClient(clientId: string, companyId: string): Promise<{
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
    } | null>;
    findServiceOrder(serviceOrderId: string, companyId: string): Promise<{
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
    } | null>;
    findTechnician(technicianId: string, companyId: string): Promise<{
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
    } | null>;
    findConflictingAppointment(companyId: string, technicianId: string, start: Date, end: Date, excludeId?: string): Promise<({
        technician: {
            name: string;
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
    }) | null>;
    create(data: Prisma.AppointmentUncheckedCreateInput): Promise<{
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
    }>;
    findMany(filters: AppointmentFilters): Promise<({
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
    })[]>;
    findByIdAndCompany(id: string, companyId: string): Promise<({
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
    }) | null>;
    update(id: string, data: Prisma.AppointmentUpdateInput): Promise<{
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
    }>;
}
