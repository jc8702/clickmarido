import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  release: process.env.VERCEL_GIT_COMMIT_SHA || undefined,

  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.5 : 1.0,

  beforeSend(event) {
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    return event;
  },
});
