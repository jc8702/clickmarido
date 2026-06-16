'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { ApiClient } from '@/lib/api/client';
import { Appointment } from '@/types/agenda';

interface ClientOption {
  id: string;
  name: string;
  phone?: string;
}

interface UserOption {
  id: string;
  name: string;
}

interface ServiceOrderOption {
  id: string;
  number: string;
}

interface AppointmentContextData {
  clients: ClientOption[];
  technicians: UserOption[];
  serviceOrders: ServiceOrderOption[];
  dataLoading: boolean;
  refreshData: () => Promise<void>;
  
  // Conflict Detection (Mocked/Basic for now, can be expanded)
  checkConflicts: (startTime: string, endTime: string, technicianId?: string) => Promise<boolean>;
}

const AppointmentContext = createContext<AppointmentContextData | undefined>(undefined);

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [technicians, setTechnicians] = useState<UserOption[]>([]);
  const [serviceOrders, setServiceOrders] = useState<ServiceOrderOption[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const refreshData = useCallback(async () => {
    setDataLoading(true);
    try {
      const [resClients, resTechs, resOrders] = await Promise.all([
        ApiClient.get<Record<string, unknown>>('/clients', { params: { limit: '100' } }).catch(() => ({ success: false, data: { items: [] } })),
        ApiClient.get<Record<string, unknown>>('/users', { params: { limit: '100', active: 'true' } }).catch(() => ({ success: false, data: { items: [] } })),
        ApiClient.get<Record<string, unknown>>('/service-orders', { params: { limit: '100' } }).catch(() => ({ success: false, data: { items: [] } }))
      ]);

      if (resClients.success) setClients(resClients.data.items);
      if (resTechs.success) setTechnicians(resTechs.data.items);
      if (resOrders.success) setServiceOrders(resOrders.data.items);
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const checkConflicts = async (startTime: string, endTime: string, technicianId?: string) => {
    if (!technicianId) return false;
    // Em uma implementação real, chamaria endpoint de conflito:
    // const res = await ApiClient.get('/appointments/check-conflict', { params: { startTime, endTime, technicianId }});
    // return res.data.hasConflict;
    return false;
  };

  return (
    <AppointmentContext.Provider value={{
      clients, technicians, serviceOrders, dataLoading, refreshData, checkConflicts
    }}>
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointmentContext() {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointmentContext must be used within an AppointmentProvider');
  }
  return context;
}
