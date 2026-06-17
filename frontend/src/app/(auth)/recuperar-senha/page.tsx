'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ApiClient } from '@/lib/api/client';

// Componente interno com useSearchParams envolto em Suspense para conformidade Next.js 15+
function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('Token de redefinição ausente. Por favor, utilize o link recebido por e-mail.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (newPassword.length < 6) {
      setError('A senha deve conter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      await ApiClient.post('/auth/reset-password', {
        token,
        newPassword,
      });
      setSuccess(true);
      // Redireciona para login após 3 segundos
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Houve um erro ao atualizar sua senha. O token pode ter expirado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card border-zinc-200/50 dark:border-zinc-900/50 shadow-2xl relative">
      <CardHeader className="space-y-3 text-center pb-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-zinc-950 font-black shadow-lg shadow-amber-500/20 select-none">
          CM
        </div>
        <div className="space-y-1">
          <CardTitle className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Nova <span className="text-amber-500">Senha</span>
          </CardTitle>
          <CardDescription className="text-zinc-500 dark:text-zinc-400 text-xs">
            Crie sua nova credencial de acesso segura
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="space-y-4 text-center py-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="h-5 w-5 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Senha redefinida!</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Sua senha foi atualizada com sucesso. Você será redirecionado para a tela de login
                em alguns instantes...
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs font-semibold text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {token && (
              <>
                {/* Nova Senha */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Nova Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="password"
                      required
                      placeholder="Mínimo 6 caracteres"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full h-11 rounded-lg border border-zinc-200 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/40 pl-10 pr-4 text-sm outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                </div>

                {/* Confirmar Nova Senha */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="password"
                      required
                      placeholder="Repita a nova senha"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-11 rounded-lg border border-zinc-200 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/40 pl-10 pr-4 text-sm outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-amber-500 hover:bg-amber-650 text-zinc-950 font-extrabold shadow-lg shadow-amber-500/10 rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-95 duration-100 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-zinc-950" />
                      <span>Salvando Senha...</span>
                    </>
                  ) : (
                    <span>Confirmar Redefinição</span>
                  )}
                </Button>
              </>
            )}

            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 pt-2 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Voltar para o Login</span>
            </Link>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/10 dark:bg-amber-500/5 blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[100px] -z-10" />

      <div className="w-full max-w-md animate-in-fade">
        <Suspense
          fallback={
            <Card className="glass-card border-zinc-200/50 dark:border-zinc-900/50 p-8 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-amber-500 mb-4" />
              <p className="text-sm text-zinc-500">Carregando formulário...</p>
            </Card>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
