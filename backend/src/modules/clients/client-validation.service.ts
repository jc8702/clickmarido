import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ClientsRepository } from './clients.repository';

@Injectable()
export class ClientValidationService {
  constructor(private readonly repo: ClientsRepository) {}

  async validateUniqueCpf(cpf: string, companyId: string, excludeClientId?: string) {
    if (!cpf) return;

    const existingClient = await this.repo.findByCpfAndCompany(cpf, companyId);
    
    if (existingClient && existingClient.id !== excludeClientId) {
      throw new BadRequestException('Já existe um cliente cadastrado com este CPF nesta empresa.');
    }
  }

  async ensureClientExists(clientId: string, companyId: string) {
    const client = await this.repo.findByIdAndCompany(clientId, companyId);
    if (!client) {
      throw new NotFoundException('Cliente não encontrado ou excluído.');
    }
    return client;
  }
}
