export interface Material {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minimumStock: number;
  averageCost: number;
  createdAt: string;
  updatedAt: string;
}

export interface MaterialMovement {
  id: string;
  materialId: string;
  type: 'ENTRADA' | 'SAIDA' | 'AJUSTE';
  quantity: number;
  unitCost: number;
  description?: string;
  createdAt: string;
}
