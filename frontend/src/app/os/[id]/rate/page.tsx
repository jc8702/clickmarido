"use client";

import { useEffect, useState, use } from "react";
import { ApiClient } from "@/lib/api/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function PublicRatePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await ApiClient.get<Record<string, unknown>>(`/public/service-orders/${resolvedParams.id}`);
        setOrder(data);
        if (data.clientRating) {
          setRating(data.clientRating);
          setReview(data.clientReview || "");
        }
      } catch (err: unknown) {
        setError(err.message || "Ordem de serviço não encontrada ou link expirado.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [resolvedParams.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Por favor, selecione uma nota de 1 a 5 estrelas.");
      return;
    }

    try {
      setSubmitting(true);
      await ApiClient.post(`/public/service-orders/${resolvedParams.id}/rate`, {
        rating,
        review,
      });
      toast.success("Avaliação enviada com sucesso!");
      setOrder({ ...order, clientRating: rating, clientReview: review });
    } catch (err: unknown) {
      toast.error(err.message || "Erro ao enviar avaliação.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Skeleton className="h-8 w-1/2 mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-24 w-full mb-4" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <CardTitle className="text-destructive">Página Indisponível</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const isRated = !!order.clientRating;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4 sm:p-6">
      <Card className="w-full max-w-md shadow-xl border-primary/10">
        
        {/* CABEÇALHO */}
        <div className="text-center pt-6 px-6 space-y-2">
          {order.company?.logoUrl && (
            <div className="relative h-12 w-full mb-4">
              <Image src={order.company.logoUrl} alt={order.company.name} fill className="object-contain" unoptimized />
            </div>
          )}
          <h1 className="text-xl font-bold">{order.company?.name || "Prestador de Serviços"}</h1>
          <p className="text-muted-foreground text-sm">
            Ordem de Serviço #{order.number}
          </p>
        </div>

        {isRated ? (
          <CardContent className="pt-6 pb-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-green-700 dark:text-green-400">Avaliação Recebida!</h2>
            <div className="flex gap-1 justify-center my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${
                    star <= (order.clientRating || 0)
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted"
                  }`}
                />
              ))}
            </div>
            <p className="text-muted-foreground text-sm max-w-xs">
              Muito obrigado pelo seu feedback. Ele é fundamental para melhorarmos sempre nossos serviços.
            </p>
          </CardContent>
        ) : (
          <>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-lg">Avalie o Serviço</CardTitle>
              <CardDescription>
                Como foi o atendimento do técnico <strong className="text-foreground">{order.technician?.name}</strong>?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* ESTRELAS */}
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <Star
                        className={`w-10 h-10 ${
                          star <= (hoverRating || rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/30 hover:text-amber-400/50"
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>

                {/* COMENTÁRIO */}
                <div className="space-y-2">
                  <label htmlFor="review" className="text-sm font-medium">
                    Deixe um comentário (opcional)
                  </label>
                  <textarea
                    id="review"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Conte-nos o que achou do serviço prestado..."
                    className="w-full min-h-[100px] p-3 rounded-md border border-input bg-transparent text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={rating === 0 || submitting}
                >
                  {submitting ? "Enviando..." : "Enviar Avaliação"}
                </Button>
              </form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
