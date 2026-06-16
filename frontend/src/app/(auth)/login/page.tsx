"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Wrench, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const { login } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
    } catch (err: unknown) {
      setError(err.message || "E-mail ou senha inválidos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300 relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/10 dark:bg-amber-500/5 blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[100px] -z-10" />

      <div className="w-full max-w-md animate-in-fade">
        <Card className="glass-card border-zinc-200/50 dark:border-zinc-900/50 shadow-2xl relative">
          <CardHeader className="space-y-3 text-center pb-4">
            {/* Logo */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-zinc-950 font-black shadow-lg shadow-amber-500/20 select-none">
              CM
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                Acesse o <span className="text-amber-500">ERP + CRM</span>
              </CardTitle>
              <CardDescription className="text-zinc-500 dark:text-zinc-400 text-xs">
                Insira suas credenciais para entrar no Click Marido
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs font-semibold text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* E-mail */}
              <div className="space-y-1.5">
                <label htmlFor="login-email" className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  E-mail institucional
                </label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    placeholder="nome@clickmarido.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 rounded-lg border border-zinc-200 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/40 pl-10 pr-4 text-sm outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="login-password" className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Senha de acesso
                  </label>
                  <Link
                    href="/esqueci-senha"
                    className="text-xs font-semibold text-amber-500 hover:text-amber-600 transition-colors"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
                  <input
                    id="login-password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 rounded-lg border border-zinc-200 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/40 pl-10 pr-4 text-sm outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              {/* Botão de Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-amber-500 hover:bg-amber-650 text-zinc-950 font-extrabold shadow-lg shadow-amber-500/10 rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-95 duration-100 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-zinc-950" />
                    <span>Autenticando...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar no Painel</span>
                    <ArrowRight className="h-4 w-4 text-zinc-950" />
                  </>
                )}
              </Button>
            </form>

            {/* Demonstração de contas */}
            <div className="mt-6 border-t border-zinc-200 dark:border-zinc-900 pt-4">
              <p className="text-[10px] font-bold text-zinc-400 uppercase text-center mb-2">
                Usuários de demonstração (Senha: senha123):
              </p>
              <div className="grid grid-cols-2 gap-1.5 text-[9px] text-zinc-500 dark:text-zinc-400">
                <div>🔑 admin@clickmarido.com.br</div>
                <div>🔧 tecnico@clickmarido.com.br</div>
                <div>📞 atendente@clickmarido.com.br</div>
                <div>💼 gestor@clickmarido.com.br</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
