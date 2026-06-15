'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Client } from '@/app/(dashboard)/clientes/columns';
import { useClientsData } from '@/app/(dashboard)/clientes/use-clients-data';

interface ClientContextData {
  // Dados e Filtros do Hook
  data: ReturnType<typeof useClientsData>;
  
  // Modais State
  isFormModalOpen: boolean;
  setIsFormModalOpen: (open: boolean) => void;
  isHistoryModalOpen: boolean;
  setIsHistoryModalOpen: (open: boolean) => void;

  // Selected Clients
  selectedClient: Client | null;
  setSelectedClient: (client: Client | null) => void;
  historyClient: Client | null;
  setHistoryClient: (client: Client | null) => void;

  // Ações globais
  handleOpenCreateModal: () => void;
  handleOpenEditModal: (client: Client) => void;
  handleOpenHistoryModal: (client: Client) => void;
}

const ClientContext = createContext<ClientContextData | undefined>(undefined);

export function ClientProvider({ children }: { children: ReactNode }) {
  const data = useClientsData();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [historyClient, setHistoryClient] = useState<Client | null>(null);

  const handleOpenCreateModal = () => {
    setSelectedClient(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (client: Client) => {
    setSelectedClient(client);
    setIsFormModalOpen(true);
  };

  const handleOpenHistoryModal = (client: Client) => {
    setHistoryClient(client);
    setIsHistoryModalOpen(true);
  };

  return (
    <ClientContext.Provider value={{
      data,
      isFormModalOpen, setIsFormModalOpen,
      isHistoryModalOpen, setIsHistoryModalOpen,
      selectedClient, setSelectedClient,
      historyClient, setHistoryClient,
      handleOpenCreateModal,
      handleOpenEditModal,
      handleOpenHistoryModal,
    }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClientContext() {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClientContext must be used within a ClientProvider');
  }
  return context;
}
