import { doubleCsrf } from 'csrf-csrf';
import type { Request } from 'express';

const csrfOptions = {
  getSecret: () => process.env.CSRF_SECRET || 'clickmarido-super-secret-csrf-key-2026',
  cookieName: 'x-csrf-token',
  cookieOptions: {
    sameSite: 'lax' as const,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  },
  size: 64,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'] as Array<"GET" | "HEAD" | "OPTIONS">,
  getCsrfTokenFromRequest: (req: Request) => {
    return (req.headers['x-csrf-token'] || req.headers['csrf-token']) as string;
  },
  getSessionIdentifier: (req: Request) => {
    return ''; // We use stateless JWTs, rely on double-submit cookie
  }
};

export const {
  generateCsrfToken,
  validateRequest,
  doubleCsrfProtection,
} = doubleCsrf(csrfOptions);
