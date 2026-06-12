"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Loader2, ArrowLeft, Send } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ApiClient } from "@/lib/api-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await ApiClient.post("/auth/forgot-password", { email });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Houve um erro ao solicitar a recuperação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/10 dark:bg-amber-500/5 blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[100px] -z-10" />

      <div className="w-full max-w-md animate-in-fade">
        <Card className="glass-card border-zinc-200/50 dark:border-zinc-900/50 shadow-2xl relative">
          <CardHeader className="space-y-3 text-center pb-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-zinc-950 font-black shadow-lg shadow-amber-500/20 select-none">
              CM
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                Recupere sua <span className="text-amber-500">Senha</span>
              </CardTitle>
              <CardDescription className="text-zinc-500 dark:text-zinc-400 text-xs">
                Informa o e-mail de acesso para receber o link de redefinição
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="space-y-4 text-center py-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                  <Send className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Instruções enviadas!</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Se o e-mail estiver cadastrado, um link de redefinição de senha foi enviado com sucesso. Verifique sua caixa de entrada e spam.
                  </p>
                  <p className="text-[10px] text-amber-500 font-semibold bg-amber-500/5 p-2 rounded border border-amber-500/10">
                    💡 Dica de desenvolvimento: Confira o console do backend ou a tabela `AppLog` para ver o link gerado!
                  </p>
                </div>
                <Link href="/login" className="block mt-4">
                  <Button className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold rounded-lg">
                    Voltar para o Login
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs font-semibold text-red-600 dark:text-red-400">
                    {error}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    E-mail cadastrado
                  </label>
                  <div className="relative">
                    <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="email"
                      required
                      placeholder="nome@clickmarido.com.br"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <span>Solicitar Nova Senha</span>
                      <Send className="h-4 w-4 text-zinc-950" />
                    </>
                  )}
                </Button>

                <Link href="/login" className="flex items-center justify-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 pt-2 transition-colors">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Voltar para o Login</span>
                </Link>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
