'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ApiClient } from '@/lib/api/client';

interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
}

interface Company {
  id: string;
  name: string;
  slug: string;
}

interface AuthContextType {
  user: User | null;
  company: Company | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helpers Nativos para manipular Cookies
const setCookie = (name: string, value: string, days: number) => {
  if (typeof window === 'undefined') return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = '; expires=' + date.toUTCString();
  document.cookie = `${name}=${value || ''}${expires}; path=/; SameSite=Lax`;
};

const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    const c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const eraseCookie = (name: string) => {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Inicializa o estado de autenticação (Silent Refresh) no carregamento inicial da página
  useEffect(() => {
    const initializeAuth = async () => {
      const storedRefreshToken = getCookie('clickmarido_refresh_token');

      if (storedRefreshToken) {
        try {
          await refreshSession();
        } catch (e) {
          // Token inválido/expirado, limpa sessões
          clearAuthData();
        }
      }
      setLoading(false);
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Monitora expiração de tokens e intercepta falhas silenciosas de rede
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Guarda referências nos cookies/localStorage para o ApiClient ler dinamicamente
    if (accessToken) {
      localStorage.setItem('clickmarido_auth_token', accessToken);
      if (company) {
        localStorage.setItem('clickmarido_active_company_id', company.id);
      }
    } else {
      localStorage.removeItem('clickmarido_auth_token');
    }
  }, [accessToken, company]);

  function clearAuthData() {
    setUser(null);
    setCompany(null);
    setAccessToken(null);
    eraseCookie('clickmarido_refresh_token');
    eraseCookie('clickmarido_session_active'); // Usado pelo Middleware
    if (typeof window !== 'undefined') {
      localStorage.removeItem('clickmarido_auth_token');
      localStorage.removeItem('clickmarido_active_company_id');
    }
  }

  async function login(email: string, password: string) {
    try {
      const data = await ApiClient.post<{
        accessToken: string;
        refreshToken: string;
        user: User;
        company: Company;
      }>('/auth/login', { email, password });

      setUser(data.user);
      setCompany(data.company);
      setAccessToken(data.accessToken);

      // Salva o Refresh Token em cookie de 7 dias
      setCookie('clickmarido_refresh_token', data.refreshToken, 7);
      // Sinaliza ativamente para o Middleware do Next.js que há uma sessão ativa
      setCookie('clickmarido_session_active', 'true', 7);
      localStorage.setItem('clickmarido_active_company_id', data.company.id);

      router.push('/dashboard');
    } catch (e) {
      clearAuthData();
      throw e;
    }
  }

  async function refreshSession(): Promise<string | null> {
    const currentRefreshToken = getCookie('clickmarido_refresh_token');
    if (!currentRefreshToken) {
      clearAuthData();
      return null;
    }

    try {
      // Faz o request de refresh
      const data = await ApiClient.post<{
        accessToken: string;
        refreshToken: string;
      }>('/auth/refresh', { refreshToken: currentRefreshToken });

      setAccessToken(data.accessToken);
      setCookie('clickmarido_refresh_token', data.refreshToken, 7);
      setCookie('clickmarido_session_active', 'true', 7);

      // Carrega informações do perfil do usuário para hidratar o state
      const meData = await ApiClient.get<User & { company: Company }>('/auth/me', {
        headers: { Authorization: `Bearer ${data.accessToken}` },
      });

      setUser({
        id: meData.id,
        email: meData.email,
        name: meData.name,
        roles: meData.roles,
        permissions: meData.permissions,
      });
      setCompany(meData.company);

      return data.accessToken;
    } catch (e) {
      clearAuthData();
      throw e;
    }
  }

  async function logout() {
    const currentRefreshToken = getCookie('clickmarido_refresh_token');
    if (currentRefreshToken) {
      await ApiClient.post('/auth/logout', { refreshToken: currentRefreshToken }).catch(() => {});
    }
    clearAuthData();
    router.push('/login');
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        company,
        accessToken,
        isAuthenticated: !!accessToken,
        loading,
        login,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
