import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  InternalServerException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  // Gera o hash SHA-256 para salvar tokens no banco com segurança
  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string) {
    const { email, password } = loginDto;

    // Busca o usuário incluindo as informações do Tenant e seus papéis
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        company: true,
        roles: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    try {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('E-mail ou senha inválidos');
      }
    } catch (error) {
      this.logger.error('Falha ao comparar senha com bcrypt:', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerException('Falha ao validar credenciais');
    }

    // Agrupa todas as permissões do usuário
    const permissions = new Set<string>();
    for (const role of user.roles ?? []) {
      const perms = role.permissions ?? [];
      for (const permission of perms) {
        permissions.add(permission.action);
      }
    }

    // Emite o Access Token JWT (curta duração: 15m a 1h, usamos 1h por padrão ou o configurado)
    const payload = {
      sub: user.id,
      email: user.email,
      companyId: user.companyId,
      roles: user.roles.map((r) => r.name),
      permissions: Array.from(permissions),
    };
    const accessToken = this.jwtService.sign(payload);

    // Emite o Refresh Token (longa duração)
    const rawRefreshToken = crypto.randomBytes(40).toString('hex');
    const hashedRefreshToken = this.hashToken(rawRefreshToken);

    // Define a expiração do Refresh Token (ex: 7 dias)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Salva a sessão no banco de dados
    await this.prisma.session.create({
      data: {
        token: hashedRefreshToken,
        userId: user.id,
        ipAddress,
        userAgent,
        expiresAt,
      },
    });

    // Retorna os dados necessários para o frontend
    return {
      accessToken,
      refreshToken: rawRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles.map((r) => r.name),
        permissions: Array.from(permissions),
      },
      company: {
        id: user.company.id,
        name: user.company.name,
        slug: user.company.slug,
      },
    };
  }

  async refresh(
    refreshTokenDto: RefreshTokenDto,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const { refreshToken } = refreshTokenDto;
    const hashedToken = this.hashToken(refreshToken);

    // Busca a sessão no banco
    const session = await this.prisma.session.findUnique({
      where: { token: hashedToken },
      include: {
        user: {
          include: {
            company: true,
            roles: {
              include: {
                permissions: true,
              },
            },
          },
        },
      },
    });

    // Valida a sessão
    if (!session) {
      throw new UnauthorizedException('Sessão inválida ou expirada');
    }

    if (new Date() > session.expiresAt) {
      // Remove a sessão expirada do banco
      await this.prisma.session
        .delete({ where: { id: session.id } })
        .catch(() => {});
      throw new UnauthorizedException('Sessão expirada');
    }

    const user = session.user;

    // Agrupa permissões
    const permissions = new Set<string>();
    for (const role of user.roles) {
      for (const permission of role.permissions) {
        permissions.add(permission.action);
      }
    }

    // Gera novo Access Token
    const payload = {
      sub: user.id,
      email: user.email,
      companyId: user.companyId,
      roles: user.roles.map((r) => r.name),
      permissions: Array.from(permissions),
    };
    const accessToken = this.jwtService.sign(payload);

    // Rotaciona o Refresh Token: Revoga o antigo e emite um novo
    const rawNewRefreshToken = crypto.randomBytes(40).toString('hex');
    const hashedNewRefreshToken = this.hashToken(rawNewRefreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Atualiza a sessão no banco de dados com o novo token
    await this.prisma.session.update({
      where: { id: session.id },
      data: {
        token: hashedNewRefreshToken,
        ipAddress: ipAddress || session.ipAddress,
        userAgent: userAgent || session.userAgent,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken: rawNewRefreshToken,
    };
  }

  async logout(refreshToken: string) {
    const hashedToken = this.hashToken(refreshToken);
    // Remove a sessão do banco de dados (revogação imediata)
    await this.prisma.session
      .delete({
        where: { token: hashedToken },
      })
      .catch(() => {
        // Ignora erro se a sessão já tiver sido deletada
      });
    return { success: true };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Por motivos de segurança, não confirmamos a inexistência do e-mail ao usuário final,
      // mas retornamos sucesso fictício para evitar enumeração de usuários.
      return { success: true };
    }

    // Gera token de redefinição (válido por 1 hora)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = this.hashToken(resetToken);

    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1);

    // Salva o token no usuário
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: hashedResetToken,
        resetExpires,
      },
    });

    // Envia o e-mail via Resend
    const resetLink = `${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/recuperar-senha?token=${resetToken}`;

    // Log para auditoria
    await this.prisma.appLog.create({
      data: {
        level: 'INFO',
        context: 'AuthService.forgotPassword',
        message: `E-mail de recuperação de senha enviado para ${email}.`,
        companyId: user.companyId,
      },
    });

    try {
      await this.emailService.sendPasswordReset(email, resetLink);
      console.log(`\n📬 [E-MAIL] Redefinição de senha enviada para: ${email}`);
    } catch (error) {
      console.error(`Erro ao enviar e-mail para ${email}:`, error);
      // Retorna sucesso para evitar enumeração de erro
    }

    return { success: true };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;
    const hashedToken = this.hashToken(token);

    // Busca o usuário pelo token de reset ativo
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: hashedToken,
        resetExpires: {
          gt: new Date(), // Deve ser maior que agora
        },
      },
    });

    if (!user) {
      throw new BadRequestException(
        'Token de redefinição inválido ou expirado',
      );
    }

    // Gera o hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualiza a senha e invalida o token de reset e todas as sessões anteriores
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetExpires: null,
        },
      }),
      // Revoga todas as sessões do usuário para forçar o logout em outros aparelhos
      this.prisma.session.deleteMany({
        where: { userId: user.id },
      }),
    ]);

    return { success: true };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        companyId: true,
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        roles: {
          select: {
            name: true,
            permissions: {
              select: {
                action: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Agrupa permissões
    const permissions = new Set<string>();
    for (const role of user.roles) {
      for (const permission of role.permissions) {
        permissions.add(permission.action);
      }
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      isActive: user.isActive,
      company: user.company,
      roles: user.roles.map((r) => r.name),
      permissions: Array.from(permissions),
    };
  }
}
