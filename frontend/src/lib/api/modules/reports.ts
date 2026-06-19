import { ApiClient } from '../client';

// Helper function to get full API URL
const getFullApiUrl = (endpoint: string) => {
  const rawApiUrl = (process.env.NEXT_PUBLIC_API_URL || '').trim().replace(/[\r\n]+/g, '');
  const API_URL = !rawApiUrl || rawApiUrl.includes('vercel.app') ? '' : rawApiUrl;
  const API_PREFIX = API_URL ? '/api/v1' : '/api';
  return `${API_URL}${API_PREFIX}${endpoint}`;
};

// Enhanced response interfaces for v2 API
export interface ExecutiveDashboard {
  totalLeads: number;
  totalQuotes: number;
  conversionRate: number | null;
  completedOrders: number;
  totalRevenue: number;
  totalProfit: number;
  activeTechs: number;
  activeWarranties: number;
}

export interface CommercialReport {
  totalQuotes: number;
  approvedQuotes: number;
  conversionRate: number | null;
  totalRevenue: number;
  completedOrders: number;
  ticketMedio: number;
  topServices: { name: string; value: number }[];
}

export interface OperationalReport {
  productivity: { name: string; concluídas: number }[];
  avgTimeDays: number | null;
}

export interface FinancialReport {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  chartData: { month: string; receita: number; despesa: number; lucro: number }[];
}

// V2 Enhanced response format
export interface EnhancedReportResponse<T> {
  success: boolean;
  data: T;
  version: 'v1' | 'v2';
  timestamp: string;
  pagination?: {
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    page?: number;
    limit?: number;
  };
}

// Health check interfaces
export interface HealthCheck {
  status: 'up' | 'down' | 'degraded';
  timestamp: string;
  uptime: number;
  checks: {
    database: string;
    cache: string;
    queries: string;
  };
}

export interface EnhancedHealthCheck extends EnhancedReportResponse<HealthCheck> {
  data: HealthCheck & {
    metadata: {
      checkedAt: string;
      service: string;
      version: string;
    };
    recommendations: string[];
  };
}

// Export interfaces
export interface ExportOptions {
  format?: 'json' | 'pdf' | 'excel';
  period?: 'day' | 'week' | 'month' | 'quarter' | 'year';
  startDate?: string;
  endDate?: string;
  filters?: Record<string, any>;
}

// API Configuration
export const API_VERSION = 'v2'; // Use v2 for enhanced features

// Base API URL with version
const getApiUrl = (endpoint: string) => {
  return `/${API_VERSION}/reports${endpoint}`;
};

// Error handling
export class ReportsApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ReportsApiError';
  }
}

// Enhanced API client with error handling
const handleApiError = (error: any) => {
  if (error.response) {
    const { status, data } = error.response;
    throw new ReportsApiError(
      data.error?.message || 'API request failed',
      status,
      data.error?.code,
      data.error?.details
    );
  } else if (error.request) {
    throw new ReportsApiError('No response received from API');
  } else {
    throw new ReportsApiError('Request setup failed');
  }
};

// API Methods
export const getExecutiveDashboard = async (): Promise<EnhancedReportResponse<ExecutiveDashboard>> => {
  try {
    return await ApiClient.get<EnhancedReportResponse<ExecutiveDashboard>>(getApiUrl('/dashboard'));
  } catch (error) {
    handleApiError(error);
    throw error; // Re-throw the error after handling
  }
};

export const getCommercialReport = async (): Promise<CommercialReport> => {
  try {
    // Commercial report still uses v1 format for compatibility
    return await ApiClient.get<CommercialReport>('/reports/commercial');
  } catch (error) {
    handleApiError(error);
    throw error; // Re-throw the error after handling
  }
};

export const getOperationalReport = async (): Promise<OperationalReport> => {
  try {
    // Operational report still uses v1 format for compatibility
    return await ApiClient.get<OperationalReport>('/reports/operational');
  } catch (error) {
    handleApiError(error);
    throw error; // Re-throw the error after handling
  }
};

export const getFinancialReport = async (): Promise<FinancialReport> => {
  try {
    // Financial report still uses v1 format for compatibility
    return await ApiClient.get<FinancialReport>('/reports/financial');
  } catch (error) {
    handleApiError(error);
    throw error; // Re-throw the error after handling
  }
};

export const getHealthCheck = async (): Promise<EnhancedHealthCheck> => {
  try {
    return await ApiClient.get<EnhancedHealthCheck>(getApiUrl('/health'));
  } catch (error) {
    handleApiError(error);
    throw error; // Re-throw the error after handling
  }
};

export const exportFinancialReport = async (options: ExportOptions = {}): Promise<Blob> => {
  try {
    const { format = 'excel', period, startDate, endDate, filters } = options;
    
    const params = new URLSearchParams();
    if (period) params.append('period', period);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        params.append(`filters[${key}]`, String(value));
      });
    }

    const response = await fetch(`${getFullApiUrl('/reports/export/financial')}${params ? `?${params}` : ''}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('clickmarido_auth_token') : ''}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new ReportsApiError(
        'Failed to export financial report',
        response.status,
        undefined,
        await response.json().catch(() => ({}))
      );
    }

    return await response.blob();
  } catch (error) {
    handleApiError(error);
    throw error; // Re-throw the error after handling
  }
};

export const exportCommercialReport = async (options: ExportOptions = {}): Promise<Blob> => {
  try {
    const { format = 'excel', period, startDate, endDate, filters } = options;
    
    const params = new URLSearchParams();
    if (period) params.append('period', period);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        params.append(`filters[${key}]`, String(value));
      });
    }

    const response = await fetch(`${getFullApiUrl('/reports/export/commercial')}${params ? `?${params}` : ''}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('clickmarido_auth_token') : ''}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new ReportsApiError(
        'Failed to export commercial report',
        response.status,
        undefined,
        await response.json().catch(() => ({}))
      );
    }

    return await response.blob();
  } catch (error) {
    handleApiError(error);
    throw error; // Re-throw the error after handling
  }
};

// Utility functions
export const downloadReport = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const generateReportFilename = (type: string, format: string = 'xlsx') => {
  const timestamp = new Date().toISOString().split('T')[0];
  return `relatorio-${type}-${timestamp}.${format}`;
};

// Cache utilities for client-side caching
export const ReportCache = {
  get: <T>(key: string): T | null => {
    try {
      const cached = localStorage.getItem(`report-cache:${key}`);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  },
  
  set: <T>(key: string, data: T, ttl: number = 30000): void => {
    try {
      const cacheItem = {
        data,
        timestamp: Date.now(),
        ttl,
      };
      localStorage.setItem(`report-cache:${key}`, JSON.stringify(cacheItem));
    } catch (error) {
      console.error('Failed to cache report data:', error);
    }
  },
  
  invalidate: (key: string): void => {
    try {
      localStorage.removeItem(`report-cache:${key}`);
    } catch (error) {
      console.error('Failed to invalidate cache:', error);
    }
  },
  
  isExpired: (key: string): boolean => {
    try {
      const cached = localStorage.getItem(`report-cache:${key}`);
      if (!cached) return true;
      
      const cacheItem = JSON.parse(cached);
      return Date.now() - cacheItem.timestamp > cacheItem.ttl;
    } catch {
      return true;
    }
  },
};

// SWR hook configuration for React
export const useReportsSWR = <T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    refreshInterval?: number;
    revalidateOnFocus?: boolean;
    shouldRetryOnError?: boolean;
  } = {}
) => {
  const { refreshInterval = 30000, revalidateOnFocus = true, shouldRetryOnError = true } = options;
  
  return {
    key,
    fetcher,
    options: {
      refreshInterval,
      revalidateOnFocus,
      shouldRetryOnError,
      onError: (error: any) => {
        console.error('Reports API error:', error);
      },
    },
  };
};
