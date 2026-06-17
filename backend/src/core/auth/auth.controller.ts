import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import * as express from 'express';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 300000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Autenticar usuário',
    description:
      'Realiza login com email e senha, retornando tokens de acesso e refresh.',
  })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'Login realizado com sucesso' })
  @ApiUnauthorizedResponse({ description: 'Credenciais inválidas' })
  async login(@Body() loginDto: LoginDto, @Req() req: express.Request) {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    try {
      return await this.authService.login(loginDto, ipAddress, userAgent);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Renovar token de acesso',
    description: 'Utiliza refresh token para obter um novo access token.',
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({ description: 'Token renovado com sucesso' })
  @ApiUnauthorizedResponse({
    description: 'Refresh token inválido ou expirado',
  })
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Req() req: express.Request,
  ) {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.authService.refresh(refreshTokenDto, ipAddress, userAgent);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Encerrar sessão',
    description: 'Invalida o refresh token, encerrando a sessão do usuário.',
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({ description: 'Sessão encerrada com sucesso' })
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.logout(refreshTokenDto.refreshToken);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Solicitar redefinição de senha',
    description: 'Envia email com link para redefinição de senha.',
  })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiOkResponse({ description: 'Email de redefinição enviado' })
  @ApiBadRequestResponse({ description: 'Email não encontrado' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Redefinir senha',
    description: 'Define nova senha utilizando token de redefinição.',
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiOkResponse({ description: 'Senha redefinida com sucesso' })
  @ApiBadRequestResponse({ description: 'Token inválido ou expirado' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Obter usuário atual',
    description:
      'Retorna os dados do usuário autenticado com base no token JWT.',
  })
  @ApiOkResponse({ description: 'Dados do usuário retornados' })
  @ApiUnauthorizedResponse({ description: 'Token inválido ou expirado' })
  async me(@Req() req: express.Request & { user: { id: string } }) {
    return this.authService.getMe(req.user.id);
  }
}
