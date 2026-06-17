"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("../email/email.service");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
let AuthService = class AuthService {
    prisma;
    jwtService;
    configService;
    emailService;
    constructor(prisma, jwtService, configService, emailService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.emailService = emailService;
    }
    hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
    async login(loginDto, ipAddress, userAgent) {
        const { email, password } = loginDto;
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
            throw new common_1.UnauthorizedException('E-mail ou senha inválidos');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('E-mail ou senha inválidos');
        }
        const permissions = new Set();
        for (const role of user.roles) {
            for (const permission of role.permissions) {
                permissions.add(permission.action);
            }
        }
        const payload = {
            sub: user.id,
            email: user.email,
            companyId: user.companyId,
            roles: user.roles.map((r) => r.name),
            permissions: Array.from(permissions),
        };
        const accessToken = this.jwtService.sign(payload);
        const rawRefreshToken = crypto.randomBytes(40).toString('hex');
        const hashedRefreshToken = this.hashToken(rawRefreshToken);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await this.prisma.session.create({
            data: {
                token: hashedRefreshToken,
                userId: user.id,
                ipAddress,
                userAgent,
                expiresAt,
            },
        });
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
    async refresh(refreshTokenDto, ipAddress, userAgent) {
        const { refreshToken } = refreshTokenDto;
        const hashedToken = this.hashToken(refreshToken);
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
        if (!session) {
            throw new common_1.UnauthorizedException('Sessão inválida ou expirada');
        }
        if (new Date() > session.expiresAt) {
            await this.prisma.session
                .delete({ where: { id: session.id } })
                .catch(() => { });
            throw new common_1.UnauthorizedException('Sessão expirada');
        }
        const user = session.user;
        const permissions = new Set();
        for (const role of user.roles) {
            for (const permission of role.permissions) {
                permissions.add(permission.action);
            }
        }
        const payload = {
            sub: user.id,
            email: user.email,
            companyId: user.companyId,
            roles: user.roles.map((r) => r.name),
            permissions: Array.from(permissions),
        };
        const accessToken = this.jwtService.sign(payload);
        const rawNewRefreshToken = crypto.randomBytes(40).toString('hex');
        const hashedNewRefreshToken = this.hashToken(rawNewRefreshToken);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
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
    async logout(refreshToken) {
        const hashedToken = this.hashToken(refreshToken);
        await this.prisma.session
            .delete({
            where: { token: hashedToken },
        })
            .catch(() => {
        });
        return { success: true };
    }
    async forgotPassword(forgotPasswordDto) {
        const { email } = forgotPasswordDto;
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return { success: true };
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedResetToken = this.hashToken(resetToken);
        const resetExpires = new Date();
        resetExpires.setHours(resetExpires.getHours() + 1);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken: hashedResetToken,
                resetExpires,
            },
        });
        const resetLink = `${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/recuperar-senha?token=${resetToken}`;
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
        }
        catch (error) {
            console.error(`Erro ao enviar e-mail para ${email}:`, error);
        }
        return { success: true };
    }
    async resetPassword(resetPasswordDto) {
        const { token, newPassword } = resetPasswordDto;
        const hashedToken = this.hashToken(token);
        const user = await this.prisma.user.findFirst({
            where: {
                resetToken: hashedToken,
                resetExpires: {
                    gt: new Date(),
                },
            },
        });
        if (!user) {
            throw new common_1.BadRequestException('Token de redefinição inválido ou expirado');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id: user.id },
                data: {
                    password: hashedPassword,
                    resetToken: null,
                    resetExpires: null,
                },
            }),
            this.prisma.session.deleteMany({
                where: { userId: user.id },
            }),
        ]);
        return { success: true };
    }
    async getMe(userId) {
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
            throw new common_1.NotFoundException('Usuário não encontrado');
        }
        const permissions = new Set();
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map