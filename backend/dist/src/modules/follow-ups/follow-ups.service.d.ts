import { PrismaService } from '../../core/prisma/prisma.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { EmailService } from '../../core/email/email.service';
export declare class FollowUpsService {
    private prisma;
    private whatsappService;
    private emailService;
    private readonly logger;
    constructor(prisma: PrismaService, whatsappService: WhatsappService, emailService: EmailService);
    syncCompletedOrders(): Promise<void>;
    handleDailyFollowUps(): Promise<void>;
    findAll(companyId: string): Promise<({
        client: {
            name: string;
            phone: string;
        };
        serviceOrder: {
            number: number;
            updatedAt: Date;
        };
    } & {
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        serviceOrderId: string;
        sent1Day: boolean;
        sent1DayAt: Date | null;
        sent7Days: boolean;
        sent7DaysAt: Date | null;
        sent30Days: boolean;
        sent30DaysAt: Date | null;
        sent90Days: boolean;
        sent90DaysAt: Date | null;
    })[]>;
    forceSync(companyId: string): Promise<{
        success: boolean;
    }>;
}
