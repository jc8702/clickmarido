'use client';

import Link from 'next/link';
import { 
  Video, 
  Layers, 
  Wrench, 
  Plus, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';
import { useVideoStudioStore } from '@/modules/video-generator/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const { projects, templates } = useVideoStudioStore();

  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const generatingProjects = projects.filter(p => p.status === 'generating').length;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Painel de Controle
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Bem-vindo ao Click Marido Marketing Studio. Crie e gerencie seus vídeos e roteiros com IA.
          </p>
        </div>
        <Link href="/projects/new">
          <Button className="flex items-center gap-2 font-semibold">
            <Plus className="w-4 h-4" />
            Novo Projeto
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total de Projetos</CardTitle>
            <Layers className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-zinc-500 mt-1">Projetos criados no estúdio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Concluídos com IA</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">{completedProjects}</div>
            <p className="text-xs text-zinc-500 mt-1">Prontos para publicação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Gerando Agora</CardTitle>
            <Sparkles className="h-4 w-4 text-blue-500 animate-spin" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{generatingProjects}</div>
            <p className="text-xs text-zinc-500 mt-1">Em processamento ativo</p>
          </CardContent>
        </Card>
      </div>

      {/* Grid Projetos & Templates */}
      <div className="grid gap-8 md:grid-cols-3">
        {/* Lista de Projetos (Esquerda/Centro) */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-blue-500" />
              Vídeos Recentes
            </h2>
          </div>

          {projects.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-zinc-800">
              <Video className="w-12 h-12 text-zinc-600 mb-4" />
              <CardTitle className="text-lg font-medium text-zinc-300">Nenhum projeto ainda</CardTitle>
              <CardDescription className="mt-1 text-sm text-zinc-500">
                Gere seu primeiro vídeo institucional ou de serviços da Click Marido.
              </CardDescription>
              <Link href="/projects/new" className="mt-6">
                <Button variant="outline" size="sm">
                  Começar Criação
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => (
                <Card key={project.id} className="hover:border-zinc-800">
                  <div className="flex items-center justify-between p-6">
                    <div className="space-y-1 pr-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/projects/${project.id}`}>
                          <h3 className="font-bold text-white hover:text-blue-400 transition-colors cursor-pointer text-base">
                            {project.name}
                          </h3>
                        </Link>
                        {project.status === 'completed' && (
                          <Badge variant="success">Pronto</Badge>
                        )}
                        {project.status === 'generating' && (
                          <Badge variant="default" className="bg-blue-600 animate-pulse">Gerando</Badge>
                        )}
                        {project.status === 'failed' && (
                          <Badge variant="destructive">Falhou</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDate(project.createdAt)}
                        </span>
                        <span>Duração: {project.briefing.duration}s</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/projects/${project.id}`}>
                        <Button variant="ghost" size="icon">
                          <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Templates Rápidos (Direita) */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-500" />
            Templates Base
          </h2>

          <div className="space-y-4">
            {templates.map((template) => (
              <Card key={template.id} className="bg-zinc-900/40 hover:bg-zinc-900/80 transition-all border-zinc-900">
                <CardHeader className="p-4">
                  <CardTitle className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-blue-500" />
                    {template.name}
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-400 mt-1 line-clamp-3">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Link href={`/projects/new?template=${template.id}`}>
                    <Button variant="secondary" size="sm" className="w-full text-xs font-semibold flex items-center justify-center gap-1.5">
                      Usar Template
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
