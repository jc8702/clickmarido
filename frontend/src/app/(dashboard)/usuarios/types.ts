export interface Role {
  id: string;
  name: string;
  description?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  companyId: string;
  createdAt: string;
  roles: Role[];
}
