import { FollowUpsService } from './follow-ups.service';
export declare class FollowUpsController {
    private readonly followUpsService;
    constructor(followUpsService: FollowUpsService);
    findAll(): Promise<({
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
    forceSync(): Promise<{
        success: boolean;
    }>;
    triggerCronManually(): Promise<{
        success: boolean;
        message: string;
    }>;
}
