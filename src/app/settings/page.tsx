'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, ShieldAlert, Sparkles, Database, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function SettingsPage() {
  const [keys, setKeys] = useState({
    geminiKey: '',
    claudeKey: '',
    openrouterKey: '',
    supabaseUrl: '',
    supabaseAnonKey: ''
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Carrega chaves salvas no localStorage se existirem (agendado de forma assíncrona para evitar re-render síncrono)
    const loadKeys = () => {
      if (typeof window !== 'undefined') {
        setKeys({
          geminiKey: localStorage.getItem('clickmarido_gemini_key') || '',
          claudeKey: localStorage.getItem('clickmarido_claude_key') || '',
          openrouterKey: localStorage.getItem('clickmarido_openrouter_key') || '',
          supabaseUrl: localStorage.getItem('clickmarido_supabase_url') || '',
          supabaseAnonKey: localStorage.getItem('clickmarido_supabase_anon_key') || ''
        });
      }
    };
    const timer = setTimeout(loadKeys, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    localStorage.setItem('clickmarido_gemini_key', keys.geminiKey);
    localStorage.setItem('clickmarido_claude_key', keys.claudeKey);
    localStorage.setItem('clickmarido_openrouter_key', keys.openrouterKey);
    localStorage.setItem('clickmarido_supabase_url', keys.supabaseUrl);
    localStorage.setItem('clickmarido_supabase_anon_key', keys.supabaseAnonKey);
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChange = (field: keyof typeof keys, value: string) => {
    setKeys(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <Settings className="w-8 h-8 text-zinc-400" />
          Configurações do Estúdio
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Gerencie suas chaves de API de Inteligência Artificial, integrações de banco de dados e credenciais sensíveis.
        </p>
      </div>

      <div className="space-y-6">
        {/* Card Alerta de Segurança */}
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardContent className="p-4 flex gap-3 items-start">
            <ShieldAlert className="w-5 h-5 text-amber-500 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-amber-400">Armazenamento Seguro Local</h4>
              <p className="text-xs text-amber-500/80 leading-relaxed">
                As chaves salvas aqui são armazenadas localmente no seu navegador (`localStorage`) para fins de MVP e testes rápidos no cliente. Em produção, configure-as nas variáveis de ambiente do seu provedor de hospedagem (Vercel, Netlify) usando as variáveis listadas no `.env.example`.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* APIs IA */}
        <Card className="border-zinc-900">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-blue-500" />
              Chaves de API de IA
            </CardTitle>
            <CardDescription>
              Necessárias para que a inteligência artificial crie os roteiros, storyboards e mídias de vídeo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-sm font-semibold text-zinc-300">Google Gemini API Key</label>
                <Badge variant="outline" className="text-zinc-500 border-zinc-800 text-[10px] font-mono">GEMINI_API_KEY</Badge>
              </div>
              <input
                type="password"
                value={keys.geminiKey}
                onChange={(e) => handleChange('geminiKey', e.target.value)}
                className="w-full h-10 px-3 rounded-md bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Insira sua chave do Google AI Studio (AIZA...)"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-sm font-semibold text-zinc-300">Anthropic Claude API Key</label>
                <Badge variant="outline" className="text-zinc-500 border-zinc-800 text-[10px] font-mono">CLAUDE_API_KEY</Badge>
              </div>
              <input
                type="password"
                value={keys.claudeKey}
                onChange={(e) => handleChange('claudeKey', e.target.value)}
                className="w-full h-10 px-3 rounded-md bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Insira sua chave da Anthropic (sk-ant-...)"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-sm font-semibold text-zinc-300">OpenRouter API Key (Recomendado)</label>
                <Badge variant="outline" className="text-zinc-500 border-zinc-800 text-[10px] font-mono">OPENROUTER_API_KEY</Badge>
              </div>
              <input
                type="password"
                value={keys.openrouterKey}
                onChange={(e) => handleChange('openrouterKey', e.target.value)}
                className="w-full h-10 px-3 rounded-md bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Insira sua chave do OpenRouter (sk-or-...)"
              />
            </div>
          </CardContent>
        </Card>

        {/* Supabase */}
        <Card className="border-zinc-900">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-4.5 h-4.5 text-emerald-500" />
              Banco de Dados (Supabase)
            </CardTitle>
            <CardDescription>
              Integração para persistência de projetos no banco PostgreSQL serverless do Supabase.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-sm font-semibold text-zinc-300">Supabase URL</label>
                <Badge variant="outline" className="text-zinc-500 border-zinc-800 text-[10px] font-mono">NEXT_PUBLIC_SUPABASE_URL</Badge>
              </div>
              <input
                type="text"
                value={keys.supabaseUrl}
                onChange={(e) => handleChange('supabaseUrl', e.target.value)}
                className="w-full h-10 px-3 rounded-md bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="https://suaprojetoid.supabase.co"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-sm font-semibold text-zinc-300">Supabase Anon Key</label>
                <Badge variant="outline" className="text-zinc-500 border-zinc-800 text-[10px] font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</Badge>
              </div>
              <input
                type="password"
                value={keys.supabaseAnonKey}
                onChange={(e) => handleChange('supabaseAnonKey', e.target.value)}
                className="w-full h-10 px-3 rounded-md bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Insira a chave pública anônima do Supabase"
              />
            </div>
          </CardContent>
        </Card>

        {/* Salvar */}
        <div className="flex justify-end pt-2">
          <Button 
            onClick={handleSave} 
            className="flex items-center gap-2 font-bold min-w-32 cursor-pointer shadow-md shadow-blue-500/10"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                Salvo!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Salvar Configurações
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
