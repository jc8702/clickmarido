'use client';

import { useEffect, useState, useRef, use } from 'react';
import { ApiClient } from '@/lib/api/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, Eraser, PenTool, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default function PublicQuotePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [quote, setQuote] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const data = await ApiClient.get<Record<string, unknown>>(
          `/public/quotes/${resolvedParams.id}`,
        );
        setQuote(data);
      } catch (err: unknown) {
        setError(err.message || 'Orçamento não encontrado ou expirado.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuote();
  }, [resolvedParams.id]);

  // Canvas drawing logic
  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);

    // Get correct coordinates whether mouse or touch
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleApprove = async () => {
    if (!hasSignature) {
      toast.error('Por favor, assine o orçamento antes de aprovar.');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const signatureBase64 = canvas.toDataURL('image/png');

    try {
      setSubmitting(true);
      await ApiClient.post(`/public/quotes/${resolvedParams.id}/sign`, {
        signature: signatureBase64,
      });
      toast.success('Orçamento aprovado com sucesso!');
      setQuote({ ...quote, status: 'Aprovado' });
    } catch (err: unknown) {
      toast.error(err.message || 'Erro ao aprovar orçamento.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <Skeleton className="h-8 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full mb-4" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <CardTitle className="text-destructive">Orçamento Indisponível</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const isApproved = quote.status === 'Aprovado';

  return (
    <div className="min-h-screen bg-muted/20 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* CABEÇALHO DA EMPRESA */}
        <div className="text-center space-y-2">
          {quote.company?.logoUrl && (
            <div className="relative h-16 w-full">
              <Image
                src={quote.company.logoUrl}
                alt={quote.company.name}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          )}
          <h1 className="text-2xl font-bold">{quote.company?.name || 'Prestador de Serviços'}</h1>
          <p className="text-muted-foreground text-sm">
            Orçamento #{quote.number} • Emitido para: {quote.client?.name}
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Detalhes do Orçamento</CardTitle>
                <CardDescription>Resumo dos serviços e valores propostos.</CardDescription>
              </div>
              <Badge variant={isApproved ? 'default' : 'secondary'} className="text-sm">
                {quote.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* SERVIÇOS */}
            <div>
              <h3 className="font-semibold mb-3 border-b pb-2">Serviços</h3>
              <div className="space-y-3">
                {quote.services?.map((item: Record<string, unknown>, idx: number) => (
                  <div key={idx} className="flex justify-between items-start text-sm">
                    <div>
                      <p className="font-medium">{item.service?.name}</p>
                      {item.service?.description && (
                        <p className="text-muted-foreground text-xs">{item.service.description}</p>
                      )}
                      <p className="text-muted-foreground mt-1">
                        {item.quantity}x de R$ {Number(item.value).toFixed(2)}
                      </p>
                    </div>
                    <div className="font-medium text-right">
                      R$ {(item.quantity * item.value).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MATERIAIS SE HOUVER */}
            {quote.materials && quote.materials.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 border-b pb-2">Materiais Estimados</h3>
                <div className="space-y-3">
                  {quote.materials.map((item: Record<string, unknown>, idx: number) => (
                    <div key={idx} className="flex justify-between items-start text-sm">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-muted-foreground mt-1">
                          {item.quantity}x de R$ {Number(item.value).toFixed(2)}
                        </p>
                      </div>
                      <div className="font-medium text-right">
                        R$ {(item.quantity * item.value).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TOTAIS */}
            <div className="border-t pt-4 space-y-2">
              {quote.travelFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxa de Deslocamento</span>
                  <span>R$ {Number(quote.travelFee).toFixed(2)}</span>
                </div>
              )}
              {quote.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Desconto Aplicado</span>
                  <span>- R$ {Number(quote.discount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Valor Total</span>
                <span className="text-primary">R$ {Number(quote.totalValue).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ÁREA DE ASSINATURA */}
        {!isApproved ? (
          <Card className="border-primary/20 shadow-md">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-lg flex items-center gap-2">
                <PenTool className="w-5 h-5 text-primary" />
                Assinatura Digital
              </CardTitle>
              <CardDescription>Para aprovar o orçamento, assine no quadro abaixo.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="border-2 border-dashed border-border rounded-lg bg-background overflow-hidden relative">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={200}
                  className="w-full touch-none cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                {!hasSignature && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
                    <span className="text-muted-foreground select-none">Assine aqui</span>
                  </div>
                )}
              </div>
              <div className="flex justify-end mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSignature}
                  type="button"
                  disabled={!hasSignature || submitting}
                >
                  <Eraser className="w-4 h-4 mr-2" />
                  Limpar Traço
                </Button>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button
                  className="w-full sm:w-auto flex-1"
                  size="lg"
                  onClick={handleApprove}
                  disabled={!hasSignature || submitting}
                >
                  {submitting ? 'Processando...' : 'Aprovar Orçamento'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center space-y-3">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-green-700 dark:text-green-400">
                Orçamento Aprovado!
              </h2>
              <p className="text-green-600 dark:text-green-500 max-w-md">
                Obrigado pela preferência. A nossa equipe entrará em contato em breve para agendar o
                serviço.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
