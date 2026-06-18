'use client';

import { useEffect } from 'react';

export default function DashboardError({
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
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
      <div className="text-center space-y-4 max-w-md">
        <div className="text-5xl font-black text-destructive">500</div>
        <h1 className="text-xl font-bold">Erro no Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Ocorreu um erro ao carregar este conteúdo.
        </p>
        <button
          onClick={() => unstable_retry()}
          className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground h-10 px-5 font-semibold hover:bg-primary/90 transition-colors text-sm"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
