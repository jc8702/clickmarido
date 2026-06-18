import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="text-8xl font-black text-muted-foreground/20">404</div>
        <h1 className="text-2xl font-bold">Página não encontrada</h1>
        <p className="text-muted-foreground">
          A página que você está procurando não existe ou foi removida.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground h-11 px-6 font-semibold hover:bg-primary/90 transition-colors"
        >
          Voltar ao Dashboard
        </Link>
      </div>
    </div>
  );
}
