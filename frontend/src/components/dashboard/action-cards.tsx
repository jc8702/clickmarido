import Link from 'next/link';
import { TrendingUp, FileText, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function ActionCards() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 mt-8 animate-in-slide" style={{ animationDelay: '0.2s' }}>
      <Card className="glass-card flex flex-col justify-between overflow-hidden relative min-h-[200px] border-border/50">
        <CardContent className="p-8 relative z-10 flex flex-col h-full justify-between">
          <div>
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-500/20 mb-4">Saúde Financeira</Badge>
            <h3 className="text-2xl font-bold">Relatório Completo</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              Analise o fluxo de caixa, as despesas corporativas e a margem de contribuição.
            </p>
          </div>
          <Link href="/relatorios">
            <Button className="w-fit mt-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">Acessar Relatórios <ArrowRight className="w-4 h-4 ml-2" /></Button>
          </Link>
        </CardContent>
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <TrendingUp className="w-64 h-64 -mb-16 -mr-16" />
        </div>
      </Card>

      <Card className="glass-card flex flex-col justify-between overflow-hidden relative min-h-[200px] border-border/50">
        <CardContent className="p-8 relative z-10 flex flex-col h-full justify-between">
          <div>
            <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-500/20 mb-4">Pipeline de Vendas</Badge>
            <h3 className="text-2xl font-bold">Gerir Orçamentos</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              Acompanhe aprovações, envie cobranças e converta orçamentos em ordens ativas.
            </p>
          </div>
          <Link href="/orcamentos">
            <Button className="w-fit mt-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">Ver Pipeline <ArrowRight className="w-4 h-4 ml-2" /></Button>
          </Link>
        </CardContent>
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <FileText className="w-64 h-64 -mb-16 -mr-16" />
        </div>
      </Card>
    </div>
  );
}
