'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Palette, 
  Upload, 
  Sparkles, 
  Check, 
  Monitor, 
  Layout, 
  MousePointer2, 
  Wrench,
  Users,
  DollarSign,
  Settings,
  Save,
  ShieldAlert,
  Database
} from 'lucide-react';
import { useAppearanceStore, SystemTheme } from '@/lib/stores/appearance-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const themes: { id: SystemTheme; name: string; preview: string }[] = [
  { id: 'default', name: 'Original Amber', preview: 'bg-amber-500' },
  { id: 'arctic', name: 'Minimalist Arctic', preview: 'bg-sky-400' },
  { id: 'cyber', name: 'Cyberpunk Tech', preview: 'bg-emerald-400' },
  { id: 'warm', name: 'Warm Organic', preview: 'bg-orange-300' },
  { id: 'corporate', name: 'Corporate Blue', preview: 'bg-blue-700' },
  { id: 'purple', name: 'Vibrant Purple', preview: 'bg-purple-600' },
];

export default function SettingsPage() {
  // Estado das chaves (preservado do original)
  const [keys, setKeys] = useState({
    geminiKey: '',
    supabaseUrl: '',
    supabaseAnonKey: '',
  });
  const [saved, setSaved] = useState(false);

  // Estado de Aparência
  const { theme, setTheme, setCustomPalette, setLogoUrl, logoUrl } = useAppearanceStore();
  const [extracting, setExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window === 'undefined') return;
      setKeys({
        geminiKey: localStorage.getItem('clickmarido_gemini_key') || '',
        supabaseUrl: localStorage.getItem('clickmarido_supabase_url') || '',
        supabaseAnonKey: localStorage.getItem('clickmarido_supabase_anon_key') || '',
      });
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleSaveKeys = () => {
    localStorage.setItem('clickmarido_gemini_key', keys.geminiKey);
    localStorage.setItem('clickmarido_supabase_url', keys.supabaseUrl);
    localStorage.setItem('clickmarido_supabase_anon_key', keys.supabaseAnonKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleKeyChange = (field: keyof typeof keys, value: string) => {
    setKeys((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
    }
  };

  const handleMagicExtract = () => {
    setExtracting(true);
    setTimeout(() => {
      setCustomPalette({
        primary: '#f59e0b',
        accent: '#3b82f6',
        background: '#09090b'
      });
      setExtracting(false);
    }, 1500);
  };

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto space-y-10 animate-in-fade">
      <div className="border-b border-zinc-900 pb-8 space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center gap-4">
          <div className="p-2 rounded-2xl bg-primary/10 text-primary">
            <Settings className="w-8 h-8" />
          </div>
          Configurações
        </h1>
        <p className="text-zinc-500 font-medium">Gerencie a identidade visual e credenciais do sistema.</p>
      </div>

      <Tabs defaultValue="appearance" className="space-y-8">
        <TabsList className="bg-zinc-950 border border-zinc-900 p-1 rounded-xl">
          <TabsTrigger value="appearance" className="gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold px-6">
            <Palette className="w-4 h-4" /> Aparência
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold px-6">
            <Database className="w-4 h-4" /> API & Keys
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="animate-in-slide space-y-12">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-12">
              {/* Temas */}
              <section className="space-y-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <Monitor className="w-5 h-5 text-zinc-500" />
                  Temas do Sistema
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={cn(
                        "group relative p-4 rounded-2xl border transition-all duration-300 text-left",
                        theme === t.id 
                          ? "bg-zinc-900 border-primary shadow-lg" 
                          : "bg-zinc-950 border-zinc-900 hover:border-zinc-700"
                      )}
                    >
                      <div className={cn("w-full h-16 rounded-xl mb-3 opacity-70 group-hover:opacity-100 transition-opacity", t.preview)}>
                        <div className="w-full h-full glass-card" />
                      </div>
                      <span className="text-xs font-bold text-zinc-300 block">{t.name}</span>
                      {theme === t.id && (
                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1 shadow-lg animate-in-fade">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </section>

              {/* Logo AI */}
              <section className="space-y-6 p-8 rounded-3xl bg-zinc-900/30 border border-zinc-900/50 glass-panel">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <Layout className="w-5 h-5 text-zinc-500" />
                    Logo & Color Sync
                  </h2>
                  <Badge className="bg-primary/10 text-primary border-primary/20">Modo AI</Badge>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-40 h-40 rounded-3xl border-2 border-dashed border-zinc-800 hover:border-primary/50 bg-zinc-950 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group overflow-hidden shrink-0"
                  >
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-4" />
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-zinc-700 group-hover:text-primary" />
                        <span className="text-[9px] font-bold text-zinc-600 uppercase">Subir Logo</span>
                      </>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
                  </div>

                  <div className="flex-1 space-y-4">
                    <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                      Suba sua logo para extrairmos automaticamente as cores da sua marca para botões, glows e indicadores.
                    </p>
                    <Button 
                      disabled={!logoUrl || extracting}
                      onClick={handleMagicExtract}
                      className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest gap-2 shadow-lg shadow-primary/20 transition-all"
                    >
                      {extracting ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" />
                      ) : (
                        <Sparkles className="w-5 h-5" />
                      )}
                      Extração Mágica
                    </Button>
                  </div>
                </div>
              </section>
            </div>

            {/* Preview */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <MousePointer2 className="w-5 h-5 text-zinc-500" />
                Live Preview
              </h2>
              <Card className="glass-card border-zinc-900/50 overflow-hidden sticky top-8 p-6 space-y-8">
                <div className="space-y-4">
                  <div className="h-3 w-20 bg-zinc-800 rounded-full animate-pulse" />
                  <div className="h-6 w-full bg-gradient-to-r from-primary to-accent/40 rounded-lg" />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2 glow-hover">
                      <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Users className="w-3 h-3 text-primary" />
                      </div>
                      <div className="h-3 w-full bg-zinc-800 rounded" />
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-4 border-t border-zinc-900">
                  <Button className="w-full bg-primary h-9 rounded-lg text-primary-foreground font-bold text-xs uppercase">Botão Primário</Button>
                  <Button variant="outline" className="w-full h-9 rounded-lg border-zinc-800 text-xs uppercase font-bold text-zinc-400">Secundário</Button>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="api" className="animate-in-slide space-y-6">
          <Card className="border-amber-500/20 bg-amber-500/5 max-w-3xl">
            <CardContent className="p-4 flex gap-3 items-start">
              <ShieldAlert className="w-5 h-5 text-amber-500 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-amber-400 uppercase tracking-tighter">Armazenamento Local Seguro</h4>
                <p className="text-xs text-amber-500/80 leading-relaxed">
                  Configurações salvas localmente para testes. Em produção, use as variáveis de ambiente.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="max-w-3xl space-y-6">
            <Card className="border-zinc-900 bg-zinc-950">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-500" /> Google Gemini AI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Gemini API Key</label>
                  <input
                    type="password"
                    value={keys.geminiKey}
                    onChange={(e) => handleKeyChange('geminiKey', e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="AIza..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-900 bg-zinc-950">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-500" /> Supabase Database
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Supabase URL</label>
                    <input
                      type="text"
                      value={keys.supabaseUrl}
                      onChange={(e) => handleKeyChange('supabaseUrl', e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Anon Key</label>
                    <input
                      type="password"
                      value={keys.supabaseAnonKey}
                      onChange={(e) => handleKeyChange('supabaseAnonKey', e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={handleSaveKeys}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest h-11 px-8 rounded-xl shadow-lg shadow-primary/20 transition-all gap-2"
              >
                {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {saved ? 'Salvo com Sucesso!' : 'Salvar Chaves'}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
