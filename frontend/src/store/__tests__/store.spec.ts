import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../useStore';

describe('Global Store (Zustand Slices)', () => {
  beforeEach(() => {
    // Reset da store para cada teste
    useStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      clients: [],
      selectedClient: null,
      loading: false,
      error: null,
      appointments: [],
      loadingAppointments: false,
      quotes: [],
      theme: 'light',
      sidebarOpen: true,
    });
  });

  it('deve logar o usuário e salvar o token (AuthSlice)', () => {
    const { login } = useStore.getState();
    const mockUser = { id: '1', name: 'Admin', email: 'admin@test.com', role: 'admin' as const };

    login(mockUser, 'fake-jwt-token');

    const state = useStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe('fake-jwt-token');
  });

  it('deve adicionar um cliente na lista (ClientsSlice)', () => {
    const { addClient } = useStore.getState();
    const mockClient = { id: 'c1', name: 'João', email: 'joao@test.com' };

    addClient(mockClient);

    const state = useStore.getState();
    expect(state.clients).toHaveLength(1);
    expect(state.clients[0]).toEqual(mockClient);
  });

  it('deve alternar o tema e a sidebar (UiSlice)', () => {
    const { toggleTheme, toggleSidebar } = useStore.getState();

    expect(useStore.getState().theme).toBe('light');
    toggleTheme();
    expect(useStore.getState().theme).toBe('dark');

    expect(useStore.getState().sidebarOpen).toBe(true);
    toggleSidebar();
    expect(useStore.getState().sidebarOpen).toBe(false);
  });
});
