import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { CompanyContext } from '../company/company.context';

/**
 * Guard que garante o CompanyContext populado após o JwtAuthGuard.
 *
 * Fluxo:
 * 1. Se o CompanyMiddleware já inicializou o ALS com companyId válido (via JWT decode
 *    antecipado), este guard apenas valida que o store não está vazio.
 * 2. Se o middleware não inicializou (JWT ausente ou malformado), e o JwtAuthGuard
 *    deixou passar (rota pública), o guard permite sem company.
 * 3. Se request.user existe mas companyId ainda não está no ALS (edge case de
 *    middleware rodando antes do JWT ser validado), o guard inicializa via run().
 *
 * DEVE ser aplicado APÓS JwtAuthGuard na cadeia de @UseGuards().
 */
@Injectable()
export class CompanyContextGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      user?: { id: string; companyId: string };
    }>();

    const user = request.user;

    // Rota pública ou sem autenticação — não há empresa a validar
    if (!user) {
      return true;
    }

    if (!user.companyId) {
      throw new UnauthorizedException('Usuário sem vínculo com empresa');
    }

    // Verifica se o ALS já foi inicializado corretamente pelo CompanyMiddleware
    const existingCompanyId = CompanyContext.getCompanyId();

    if (existingCompanyId && existingCompanyId === user.companyId) {
      // ALS já está correto — middleware fez o trabalho
      return true;
    }

    // ALS ausente ou desincronizado: atualiza via setters (o store já existe pois
    // o middleware chama next() dentro do run() antes de chegar ao guard)
    // Se o middleware não criou o run() (sem JWT no header), o store é undefined
    // e setCompanyId() não terá efeito — por segurança, bloqueamos abaixo.
    const store = CompanyContext.getStore();

    if (!store) {
      // Store ausente: middleware não inicializou ALS (request sem header JWT
      // mas com user populado — situação impossível em produção mas defensiva aqui)
      throw new UnauthorizedException(
        'Contexto de empresa não inicializado — verifique o fluxo de autenticação',
      );
    }

    // Sincroniza o store com o user do JWT (caso middleware tenha decoded parcialmente)
    CompanyContext.setCompanyId(user.companyId);
    if (user.id) {
      CompanyContext.setUserId(user.id);
    }

    return true;
  }
}
