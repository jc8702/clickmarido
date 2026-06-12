import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'clickmarido-super-secret-key-change-in-production-12345',
      signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as any }, // access token expira em 1 hora
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [PassportModule, JwtModule, JwtAuthGuard, AuthService],
})
export class AuthModule {}
