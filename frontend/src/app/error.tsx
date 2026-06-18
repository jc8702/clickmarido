'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="text-6xl font-black text-destructive">500</div>
        <h1 className="text-2xl font-bold">Algo deu errado</h1>
        <p className="text-muted-foreground">
          Ocorreu um erro inesperado ao carregar esta página.
        </p>
        <button
          onClick={() => unstable_retry()}
          className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground h-11 px-6 font-semibold hover:bg-primary/90 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
