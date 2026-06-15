import { ApiClient } from '../client';

export interface FollowUp {
  id: string;
  companyId: string;
  clientId: string;
  serviceOrderId: string;
  sent1Day: boolean;
  sent1DayAt?: string;
  sent7Days: boolean;
  sent7DaysAt?: string;
  sent30Days: boolean;
  sent30DaysAt?: string;
  sent90Days: boolean;
  sent90DaysAt?: string;
  client?: { name: string, phone: string };
  serviceOrder?: { number: number, updatedAt: string };
}

export const getFollowUps = async () => {
  return await ApiClient.get<FollowUp[]>('/follow-ups');
};

export const syncFollowUps = async () => {
  return await ApiClient.post<void>('/follow-ups/sync');
};

export const triggerCronManually = async () => {
  return await ApiClient.post<void>('/follow-ups/trigger');
};
