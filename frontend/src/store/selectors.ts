import { useStore } from './useStore';

export const useAuth = () => {
  return useStore((state) => ({
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    login: state.login,
    logout: state.logout,
  }));
};

export const useClients = () => {
  return useStore((state) => ({
    clients: state.clients,
    selectedClient: state.selectedClient,
    loading: state.loading,
    error: state.error,
    setClients: state.setClients,
    selectClient: state.selectClient,
    addClient: state.addClient,
    updateClient: state.updateClient,
    deleteClient: state.deleteClient,
    setLoading: state.setLoading,
    setError: state.setError,
  }));
};

export const useAppointments = () => {
  return useStore((state) => ({
    appointments: state.appointments,
    loadingAppointments: state.loadingAppointments,
    setAppointments: state.setAppointments,
    addAppointment: state.addAppointment,
    removeAppointment: state.removeAppointment,
  }));
};

export const useFinancial = () => {
  return useStore((state) => ({
    quotes: state.quotes,
    setQuotes: state.setQuotes,
    approveQuote: state.approveQuote,
  }));
};

export const useUi = () => {
  return useStore((state) => ({
    theme: state.theme,
    sidebarOpen: state.sidebarOpen,
    toggleTheme: state.toggleTheme,
    toggleSidebar: state.toggleSidebar,
  }));
};
