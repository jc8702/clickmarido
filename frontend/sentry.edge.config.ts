import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  release: process.env.VERCEL_GIT_COMMIT_SHA || undefined,

  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.25 : 1.0,
});
