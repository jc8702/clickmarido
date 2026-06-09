'use client';

import Link from 'next/link';
import { Layers, Wrench, Sparkles } from 'lucide-react';
import { useVideoStudioStore } from '@/modules/video-generator/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function TemplatesPage() {
  const { templates } = useVideoStudioStore();

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <Layers className="w-8 h-8 text-blue-500" />
          Templates de Vídeo
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Biblioteca de roteiros estruturados e briefings pré-definidos para agilizar a criação de campanhas.
        </p>
      </div>

      {/* Grid Templates */}
      <div className="grid gap-6 md:grid-cols-2">
        {templates.map((template) => (
          <Card key={template.id} className="bg-zinc-900/20 hover:bg-zinc-900/60 transition-all border-zinc-900 flex flex-col justify-between">
            <CardHeader className="space-y-2">
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="text-blue-400 border-blue-500/20 bg-blue-500/5 font-mono">
                  SaaS Core
                </Badge>
                <Badge variant="success">Padrão</Badge>
              </div>
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2 mt-2">
                <Wrench className="w-4.5 h-4.5 text-blue-500" />
                {template.name}
              </CardTitle>
              <CardDescription className="text-sm text-zinc-400 mt-1 line-clamp-4">
                {template.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-4">
                {/* Visual Quick Info */}
                <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-900 text-xxs space-y-1.5 font-mono">
                  <div className="flex justify-between text-zinc-500">
                    <span>Duração:</span>
                    <span className="text-zinc-300 font-bold">{template.briefing.duration}s</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>Serviços:</span>
                    <span className="text-zinc-300 font-bold truncate max-w-[180px]">{template.briefing.services.slice(0, 3).join(', ')}...</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>Público:</span>
                    <span className="text-zinc-300 font-bold truncate max-w-[180px]">{template.briefing.targetAudience}</span>
                  </div>
                </div>

                <Link href={`/projects/new?template=${template.id}`} className="block">
                  <Button className="w-full flex items-center justify-center gap-2 font-bold cursor-pointer">
                    <Sparkles className="w-4 h-4" />
                    Criar com este Template
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Card Mock para futuros templates */}
        <Card className="border-dashed border-zinc-800 bg-transparent flex flex-col items-center justify-center p-8 text-center">
          <Layers className="w-10 h-10 text-zinc-700 mb-3" />
          <h3 className="text-sm font-bold text-zinc-300">Novo Template</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-[200px]">
            Salve campanhas finalizadas como templates para acelerar o fluxo de novas postagens.
          </p>
          <Button variant="outline" size="sm" className="mt-4 border-zinc-800 text-zinc-500 cursor-not-allowed" disabled>
            Em breve no SaaS
          </Button>
        </Card>
      </div>
    </div>
  );
}
