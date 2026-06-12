import * as express from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto, req: express.Request): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            roles: string[];
            permissions: string[];
        };
        company: {
            id: string;
            name: string;
            slug: string;
        };
    }>;
    refresh(refreshTokenDto: RefreshTokenDto, req: express.Request): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(refreshTokenDto: RefreshTokenDto): Promise<{
        success: boolean;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        success: boolean;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        success: boolean;
    }>;
    me(req: any): Promise<{
        id: string;
        email: string;
        name: string;
        isActive: boolean;
        company: {
            id: string;
            name: string;
            slug: string;
        };
        roles: string[];
        permissions: string[];
    }>;
}
