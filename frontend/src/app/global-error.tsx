'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
          <div className="text-center space-y-4 max-w-md">
            <div className="text-6xl font-black text-destructive">500</div>
            <h1 className="text-2xl font-bold">Erro interno do servidor</h1>
            <p className="text-muted-foreground">
              Ocorreu um erro inesperado. Nossa equipe foi notificada automaticamente.
            </p>
            <button
              onClick={() => unstable_retry()}
              className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground h-11 px-6 font-semibold hover:bg-primary/90 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
