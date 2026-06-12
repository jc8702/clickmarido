import { ApiClient } from './api-client';

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
  const res: any = await ApiClient.get('/follow-ups');
  return res as FollowUp[];
};

export const syncFollowUps = async () => {
  const res: any = await ApiClient.post('/follow-ups/sync');
  return res;
};

export const triggerCronManually = async () => {
  const res: any = await ApiClient.post('/follow-ups/trigger');
  return res;
};
