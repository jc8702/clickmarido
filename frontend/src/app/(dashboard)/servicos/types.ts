export interface Service {
  id: string;
  category: 'Elétrica' | 'Hidráulica' | 'Instalações' | 'Marcenaria' | string;
  name: string;
  description?: string;
  value: number;
  averageTime: number;
  complexity: 'Baixa' | 'Média' | 'Alta' | string;
  warranty: number;
  specialty?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
