import Link from 'next/link';

export default function DashboardNotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
      <div className="text-center space-y-4 max-w-md">
        <div className="text-7xl font-black text-muted-foreground/20">404</div>
        <h1 className="text-xl font-bold">Página não encontrada</h1>
        <p className="text-muted-foreground text-sm">
          Esta página não existe no Dashboard.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground h-10 px-5 font-semibold hover:bg-primary/90 transition-colors text-sm"
        >
          Voltar ao Dashboard
        </Link>
      </div>
    </div>
  );
}
