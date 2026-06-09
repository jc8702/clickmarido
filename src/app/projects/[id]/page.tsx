'use client';

import { use, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  Video,
  FileText,
  Image as ImageIcon,
  Camera,
  MessageSquare,
  Database,
  ArrowRight,
  Clock,
  Upload,
  X,
  Film,
  Play,
  Download,
  Loader2
} from 'lucide-react';
import { useVideoStudioStore } from '@/modules/video-generator/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate } from '@/lib/utils';

export default function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const { projects, deleteProject, generateContentForProject, addImage, removeImage, generateVideo, isGeneratingVideo } = useVideoStudioStore();
  const project = projects.find(p => p.id === id);

  const [activeTab, setActiveTab] = useState('script');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  useEffect(() => {
    const onProgress = (e: Event) => {
      setVideoProgress((e as CustomEvent).detail);
    };
    window.addEventListener('video-gen-progress', onProgress);
    return () => window.removeEventListener('video-gen-progress', onProgress);
  }, []);

  useEffect(() => {
    if (project?.status !== 'generating') return;

    const interval = setInterval(() => {
      setLoadingStep(prev => (prev + 1) % 4);
    }, 2500);

    return () => clearInterval(interval);
  }, [project?.status]);

  if (!project) {
    return (
      <div className="p-8 text-center max-w-md mx-auto space-y-4 pt-32">
        <h2 className="text-xl font-bold text-white">Projeto não encontrado</h2>
        <p className="text-sm text-zinc-400">O projeto solicitado não existe ou foi excluído.</p>
        <Link href="/dashboard">
          <Button variant="outline" size="sm">
            Voltar ao Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      deleteProject(project.id);
      router.push('/dashboard');
    }
  };

  const handleRegenerate = async () => {
    await generateContentForProject(project.id);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      alert('Imagem muito grande. Máximo 5MB.');
      setUploading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      addImage(project.id, {
        id: `img-${Date.now()}`,
        dataUrl,
        name: file.name,
        scene: project.storyboard?.[project.images?.length || 0]?.scene || `Imagem ${(project.images?.length || 0) + 1}`
      });
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.onerror = () => {
      alert('Erro ao ler a imagem');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateVideo = async () => {
    await generateVideo(project.id);
  };

  const loadingStepsText = [
    'Analisando o briefing e serviços...',
    'Estruturando o roteiro publicitário...',
    'Roteirizando storyboard de cenas...',
    'Otimizando prompts cinematográficos de vídeo...'
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-900 pb-5">
        <div className="space-y-1">
          <Link href="/dashboard" className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white mb-2 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              {project.name}
            </h1>
            {project.status === 'completed' && <Badge variant="success">Pronto</Badge>}
            {project.status === 'generating' && <Badge variant="default" className="bg-blue-600 animate-pulse">Processando</Badge>}
            {project.status === 'failed' && <Badge variant="destructive">Falhou</Badge>}
          </div>
          <p className="text-xs text-zinc-500 font-mono">
            Criado em: {formatDate(project.createdAt)} • Duração: {project.briefing.duration}s
          </p>
        </div>

        <div className="flex items-center gap-2">
          {project.status !== 'generating' && (
            <Button variant="outline" size="sm" onClick={handleRegenerate} className="flex items-center gap-1.5 font-semibold text-xs text-zinc-300">
              <RefreshCw className="w-3.5 h-3.5" />
              Regerar com IA
            </Button>
          )}
          <Button variant="destructive" size="sm" onClick={handleDelete} className="flex items-center gap-1.5 font-semibold text-xs">
            <Trash2 className="w-3.5 h-3.5" />
            Excluir
          </Button>
        </div>
      </div>

      {project.status === 'generating' && (
        <div className="flex flex-col items-center justify-center p-16 text-center space-y-6 border border-zinc-900 rounded-lg bg-zinc-900/10 min-h-[400px]">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-20 h-20 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
            <Sparkles className="w-8 h-8 text-blue-500 animate-pulse" />
          </div>

          <div className="space-y-2 max-w-sm">
            <h3 className="text-lg font-bold text-white">Criando Conteúdo...</h3>
            <p className="text-sm text-zinc-400 font-mono animate-pulse">
              {loadingStepsText[loadingStep]}
            </p>
          </div>

          <div className="w-64 bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full transition-all duration-500 ease-out"
              style={{ width: `${(loadingStep + 1) * 25}%` }}
            ></div>
          </div>
          <span className="text-xxs text-zinc-500">Isso pode levar de 5 a 15 segundos.</span>
        </div>
      )}

      {project.status === 'failed' && (
        <div className="flex flex-col items-center justify-center p-16 text-center space-y-6 border border-red-500/20 rounded-lg bg-red-500/5 min-h-[400px]">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
            <RefreshCw className="w-6 h-6 text-red-400" />
          </div>
          <div className="space-y-2 max-w-sm">
            <h3 className="text-lg font-bold text-white">A geração falhou</h3>
            <p className="text-sm text-zinc-400">
              Ocorreu um problema ao conectar com o serviço de IA. Você pode tentar reprocessar.
            </p>
          </div>
          <Button variant="default" onClick={handleRegenerate} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Tentar Novamente
          </Button>
        </div>
      )}

      {project.status === 'completed' && (
        <Tabs defaultValue="script" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center border-b border-zinc-900 pb-px overflow-x-auto">
            <TabsList className="bg-transparent border-0 p-0 flex gap-4 h-auto">
              <TabsTrigger value="script" className="px-1 py-3 border-b-2 border-transparent text-sm bg-transparent rounded-none h-auto">
                <span className="flex items-center gap-2"><FileText className="w-4 h-4" />Roteiro</span>
              </TabsTrigger>
              <TabsTrigger value="storyboard" className="px-1 py-3 border-b-2 border-transparent text-sm bg-transparent rounded-none h-auto">
                <span className="flex items-center gap-2"><ImageIcon className="w-4 h-4" />Storyboard</span>
              </TabsTrigger>
              <TabsTrigger value="prompts" className="px-1 py-3 border-b-2 border-transparent text-sm bg-transparent rounded-none h-auto">
                <span className="flex items-center gap-2"><Video className="w-4 h-4" />Prompts</span>
              </TabsTrigger>
              <TabsTrigger value="images" className="px-1 py-3 border-b-2 border-transparent text-sm bg-transparent rounded-none h-auto">
                <span className="flex items-center gap-2"><Upload className="w-4 h-4" />Imagens</span>
              </TabsTrigger>
              <TabsTrigger value="video" className="px-1 py-3 border-b-2 border-transparent text-sm bg-transparent rounded-none h-auto">
                <span className="flex items-center gap-2"><Film className="w-4 h-4" />Vídeo</span>
              </TabsTrigger>
              <TabsTrigger value="caption" className="px-1 py-3 border-b-2 border-transparent text-sm bg-transparent rounded-none h-auto">
                <span className="flex items-center gap-2"><Camera className="w-4 h-4" />Legenda</span>
              </TabsTrigger>
              <TabsTrigger value="briefing" className="px-1 py-3 border-b-2 border-transparent text-sm bg-transparent rounded-none h-auto">
                <span className="flex items-center gap-2"><Database className="w-4 h-4" />Briefing</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB: ROTEIRO */}
          <TabsContent value="script" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-1 flex justify-center">
                <div className="w-[280px] h-[500px] border-8 border-zinc-800 rounded-[36px] bg-zinc-950 p-4 relative overflow-hidden shadow-2xl flex flex-col justify-between">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-zinc-800 rounded-full flex items-center justify-center text-[8px] text-zinc-500 font-mono">
                    Click Marido
                  </div>
                  <div className="flex-1 mt-6 flex flex-col justify-end pb-8 space-y-4 text-xs">
                    <div className="bg-black/40 backdrop-blur-md p-3 rounded-lg border border-white/10 text-white leading-relaxed">
                      <p className="font-bold text-blue-400 mb-1">Roteiro Ativo:</p>
                      <p className="italic font-light">&quot;{project.script?.hook}&quot;</p>
                      <p className="mt-2 text-xxs text-zinc-300 line-clamp-3">
                        {project.script?.scene1}
                      </p>
                    </div>
                    <div className="bg-blue-600 p-2.5 rounded-lg text-white font-bold flex items-center justify-between shadow-lg">
                      <span className="text-[10px]">Orçamento WhatsApp</span>
                      <ArrowRight className="w-3.5 h-3.5 animate-bounce" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <Card className="border-zinc-900">
                  <CardHeader className="flex flex-row justify-between items-center">
                    <div>
                      <CardTitle className="text-base font-bold text-white">Roteiro Gerado</CardTitle>
                      <CardDescription>Use esta estrutura para gravar a locução ou orientar o vídeo.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleCopy(JSON.stringify(project.script, null, 2), 'full-script')}>
                      {copiedId === 'full-script' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-900 relative">
                      <Badge className="absolute -top-2.5 left-3 bg-blue-600">Hook (0-5s)</Badge>
                      <p className="text-white font-bold text-sm leading-relaxed mt-2">{project.script?.hook}</p>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-900 relative">
                        <Badge className="absolute -top-2.5 left-3 bg-zinc-800 text-zinc-300">Cena 1 (Problema)</Badge>
                        <p className="text-zinc-300 text-sm leading-relaxed mt-2">{project.script?.scene1}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-900 relative">
                        <Badge className="absolute -top-2.5 left-3 bg-zinc-800 text-zinc-300">Cena 2 (Transição)</Badge>
                        <p className="text-zinc-300 text-sm leading-relaxed mt-2">{project.script?.scene2}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-900 relative">
                        <Badge className="absolute -top-2.5 left-3 bg-zinc-800 text-zinc-300">Cena 3 (Resultado)</Badge>
                        <p className="text-zinc-300 text-sm leading-relaxed mt-2">{project.script?.scene3}</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20 relative">
                      <Badge className="absolute -top-2.5 left-3 bg-blue-600">CTA (WhatsApp)</Badge>
                      <p className="text-blue-200 font-bold text-sm leading-relaxed mt-2">{project.script?.cta}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* TAB: STORYBOARD */}
          <TabsContent value="storyboard" className="space-y-4">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {project.storyboard?.map((item, idx) => (
                <Card key={idx} className="border-zinc-900 bg-zinc-950 flex flex-col justify-between">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="text-zinc-400 font-mono">{item.scene}</Badge>
                      <span className="text-xxs text-zinc-500 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.duration}
                      </span>
                    </div>
                    <CardTitle className="text-sm font-bold text-white mt-2">Foco Visual</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-1">
                    <div className="space-y-1.5 text-xs">
                      <span className="text-zinc-500 font-semibold uppercase block text-xxs font-mono">Câmera</span>
                      <p className="text-zinc-300">{item.camera}</p>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <span className="text-zinc-500 font-semibold uppercase block text-xxs font-mono">Ambiente</span>
                      <p className="text-zinc-300">{item.environment}</p>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <span className="text-zinc-500 font-semibold uppercase block text-xxs font-mono">Ação Física</span>
                      <p className="text-zinc-200 font-medium leading-relaxed">{item.action}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* TAB: PROMPTS */}
          <TabsContent value="prompts" className="space-y-6">
            <div className="bg-zinc-900/40 p-4 rounded-lg border border-zinc-900 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">Prompts Cinematográficos Otimizados</h4>
                <p className="text-xs text-zinc-400">
                  Os prompts abaixo foram otimizados em inglês para modelos de geração de vídeo (Gemini Veo, Kling, Runway Gen-2, Sora). Use-os com o gerador de vídeo na aba &quot;Vídeo&quot;.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {project.prompts?.map((item, idx) => (
                <Card key={idx} className="border-zinc-900">
                  <CardHeader className="flex flex-row justify-between items-center pb-2">
                    <Badge variant="outline" className="text-blue-400 border-blue-500/20 bg-blue-500/5 font-mono">{item.scene}</Badge>
                    <Button variant="ghost" size="sm" className="text-xs gap-1.5 cursor-pointer" onClick={() => handleCopy(`Prompt:\n${item.prompt}\n\nNegative Prompt:\n${item.negativePrompt}`, `prompt-${idx}`)}>
                      {copiedId === `prompt-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      Copiar Tudo
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xxs font-mono uppercase text-zinc-500 font-semibold">Prompt Principal</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(item.prompt, `prompt-main-${idx}`)}>
                          {copiedId === `prompt-main-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </Button>
                      </div>
                      <p className="p-3 bg-zinc-950 rounded-lg text-sm text-zinc-200 border border-zinc-900 leading-relaxed font-mono select-all">{item.prompt}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xxs font-mono uppercase text-zinc-500 font-semibold">Negative Prompt</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(item.negativePrompt, `prompt-neg-${idx}`)}>
                          {copiedId === `prompt-neg-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </Button>
                      </div>
                      <p className="p-2.5 bg-zinc-950 rounded-lg text-xs text-zinc-400 border border-zinc-900 font-mono">{item.negativePrompt}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* TAB: IMAGENS */}
          <TabsContent value="images" className="space-y-6">
            <div className="bg-zinc-900/40 p-4 rounded-lg border border-zinc-900 flex items-start gap-3">
              <Upload className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">Imagens de Referência</h4>
                <p className="text-xs text-zinc-400">
                  Faça upload de fotos dos ambientes, produtos ou serviços para usar como referência na geração do vídeo. Máximo 5MB por imagem.
                </p>
              </div>
            </div>

            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
              {project.images?.map((img) => (
                <div key={img.id} className="relative group rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 aspect-[4/3]">
                  <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="destructive" size="icon" className="w-8 h-8" onClick={() => removeImage(project.id, img.id)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <p className="text-xxs text-zinc-300 truncate">{img.name}</p>
                  </div>
                </div>
              ))}

              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative rounded-lg border-2 border-dashed border-zinc-800 hover:border-blue-500/50 bg-zinc-950 aspect-[4/3] flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Upload className="w-6 h-6 text-zinc-500" />
                <span className="text-xs text-zinc-500 font-medium">
                  {uploading ? 'Carregando...' : 'Adicionar Imagem'}
                </span>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />

            {(!project.images || project.images.length === 0) && (
              <div className="text-center p-8 text-zinc-500 text-sm">
                Nenhuma imagem adicionada ainda. Faça upload de fotos para usar como referência na geração do vídeo.
              </div>
            )}
          </TabsContent>

          {/* TAB: VÍDEO */}
          <TabsContent value="video" className="space-y-6">
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-4 rounded-lg border border-purple-500/20 flex items-start gap-3">
              <Film className="w-5 h-5 text-purple-500 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">Gerar Vídeo Automaticamente</h4>
                <p className="text-xs text-zinc-400">
                  O vídeo é gerado diretamente no seu navegador usando as imagens de referência + roteiro. Sem necessidade de API externa.
                  {(!project.images || project.images.length === 0) && ' Adicione imagens na aba "Imagens" primeiro.'}
                </p>
              </div>
            </div>

            {project.video?.status === 'completed' && project.video.url ? (
              <Card className="border-zinc-900 overflow-hidden">
                <div className="aspect-video bg-zinc-950">
                  <video
                    src={project.video.url}
                    controls
                    className="w-full h-full"
                    poster=""
                  >
                    Seu navegador não suporta vídeo.
                  </video>
                </div>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-white">Vídeo Gerado</p>
                      <p className="text-xs text-zinc-400">Reproduza ou faça download</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          const a = document.createElement('a');
                          a.href = project.video!.url;
                          a.download = `clickmarido-${project.id.slice(0, 8)}.webm`;
                          a.click();
                        }}
                      >
                        <Download className="w-3.5 h-3.5 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <Button size="sm" onClick={handleGenerateVideo} disabled={isGeneratingVideo} className="w-full">
                    {isGeneratingVideo ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Gerando...</>
                    ) : (
                      <><RefreshCw className="w-4 h-4 mr-2" />Regenerar Vídeo</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ) : isGeneratingVideo ? (
              <div className="flex flex-col items-center justify-center p-12 text-center space-y-6 border border-zinc-900 rounded-lg bg-zinc-900/10 min-h-[300px]">
                <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
                <div className="space-y-2 max-w-md">
                  <h3 className="text-lg font-bold text-white">Gerando Vídeo...</h3>
                  <p className="text-sm text-zinc-400">
                    Renderizando {project.images?.length || 0} imagem(ns) com o roteiro em 1080x1920.
                  </p>
                </div>
                <div className="w-full max-w-sm bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${videoProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-zinc-500">{videoProgress}%</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center space-y-6 border border-zinc-900 rounded-lg bg-zinc-900/10 min-h-[300px]">
                <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                  <Film className="w-8 h-8 text-purple-400" />
                </div>
                <div className="space-y-2 max-w-md">
                  <h3 className="text-lg font-bold text-white">Vídeo ainda não gerado</h3>
                  <p className="text-sm text-zinc-400">
                    {project.images && project.images.length > 0
                      ? `${project.images.length} imagem(ns) carregada(s). O vídeo será criado em formato vertical (1080x1920) com as imagens + texto do roteiro.`
                      : 'Adicione imagens de referência na aba "Imagens" para gerar o vídeo com o roteiro.'}
                  </p>
                  {(project.images && project.images.length > 0) && (
                    <div className="flex flex-wrap justify-center gap-2 mt-3">
                      {project.images.map(img => (
                        <img key={img.id} src={img.dataUrl} alt={img.name} className="w-12 h-12 object-cover rounded-md border border-zinc-800" />
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  size="lg"
                  onClick={handleGenerateVideo}
                  disabled={isGeneratingVideo || !project.images || project.images.length === 0}
                  className="flex items-center gap-2 font-bold shadow-md shadow-purple-500/10"
                >
                  <Play className="w-5 h-5" />
                  Gerar Vídeo Agora
                </Button>
              </div>
            )}
          </TabsContent>

          {/* TAB: LEGENDA */}
          <TabsContent value="caption" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-zinc-900">
                <CardHeader className="flex flex-row justify-between items-center">
                  <div>
                    <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                      <Camera className="w-4 h-4 text-purple-500" />
                      Legenda do Post
                    </CardTitle>
                    <CardDescription>Cópia otimizada para engajamento no Instagram.</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleCopy(project.caption?.instagramCaption || '', 'caption-text')}>
                    {copiedId === 'caption-text' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="p-4 bg-zinc-950 rounded-lg text-sm text-zinc-300 border border-zinc-900 whitespace-pre-wrap leading-relaxed select-all">
                    {project.caption?.instagramCaption}
                  </p>
                </CardContent>
              </Card>
              <div className="space-y-6">
                <Card className="border-zinc-900">
                  <CardHeader className="flex flex-row justify-between items-center">
                    <div>
                      <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-emerald-500" />
                        Chamada WhatsApp
                      </CardTitle>
                      <CardDescription>Direcionamento estratégico para fechar orçamentos.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleCopy(project.caption?.whatsappCta || '', 'cta-text')}>
                      {copiedId === 'cta-text' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="p-4 bg-zinc-950 rounded-lg text-sm text-white font-bold border border-zinc-900 leading-relaxed select-all">
                      {project.caption?.whatsappCta}
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-zinc-900">
                  <CardHeader className="flex flex-row justify-between items-center">
                    <div>
                      <CardTitle className="text-base font-bold text-white">Hashtags Selecionadas</CardTitle>
                      <CardDescription>SEO local e nicho de reparos.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleCopy(project.caption?.hashtags.join(' ') || '', 'hashtags-text')}>
                      {copiedId === 'hashtags-text' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.caption?.hashtags.map((tag) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* TAB: BRIEFING */}
          <TabsContent value="briefing">
            <Card className="border-zinc-900">
              <CardHeader>
                <CardTitle className="text-base font-bold text-white">Briefing do Projeto</CardTitle>
                <CardDescription>Configurações originais fornecidas para a geração.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-1">
                    <span className="text-xxs text-zinc-500 font-mono uppercase block font-semibold">Empresa</span>
                    <p className="text-sm text-white font-bold">{project.briefing.companyName}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xxs text-zinc-500 font-mono uppercase block font-semibold">Segmento</span>
                    <p className="text-sm text-zinc-300">{project.briefing.segment}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xxs text-zinc-500 font-mono uppercase block font-semibold">Objetivo do Vídeo</span>
                    <p className="text-sm text-zinc-300">{project.briefing.videoObjective}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xxs text-zinc-500 font-mono uppercase block font-semibold">Público-alvo</span>
                    <p className="text-sm text-zinc-300">{project.briefing.targetAudience}</p>
                  </div>
                </div>
                <div className="space-y-2.5 pt-4 border-t border-zinc-900">
                  <span className="text-xxs text-zinc-500 font-mono uppercase block font-semibold">Serviços Selecionados</span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.briefing.services.map(s => (
                      <Badge key={s} variant="outline" className="text-zinc-300 border-zinc-800">{s}</Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2.5 pt-4 border-t border-zinc-900">
                  <span className="text-xxs text-zinc-500 font-mono uppercase block font-semibold">Diferenciais Destacados</span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.briefing.differentials.map(d => (
                      <Badge key={d} variant="outline" className="text-blue-400 border-blue-500/20 bg-blue-500/5">{d}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
