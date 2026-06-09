'use client';

import { Suspense } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { Wrench, Sparkles, ArrowLeft } from 'lucide-react';
import { useVideoStudioStore } from '@/modules/video-generator/store';
import { Briefing } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const briefingSchema = z.object({
  companyName: z.string().min(2, 'Nome da empresa é obrigatório'),
  segment: z.string().min(2, 'Segmento é obrigatório'),
  services: z.array(z.string()).min(1, 'Selecione pelo menos um serviço'),
  targetAudience: z.string().min(2, 'Informe o público-alvo'),
  differentials: z.array(z.string()).min(1, 'Selecione pelo menos um diferencial'),
  videoObjective: z.string().min(5, 'Descreva o objetivo do vídeo (mín. 5 caracteres)'),
  duration: z.union([z.literal(15), z.literal(30), z.literal(60)])
});

type BriefingFormValues = z.infer<typeof briefingSchema>;

const LISTA_SERVICOS = [
  'Limpeza de caixa d\'água',
  'Reparos elétricos',
  'Reparos hidráulicos',
  'Troca de torneiras',
  'Troca de válvulas',
  'Instalação de chuveiros',
  'Troca de tomadas',
  'Troca de interruptores',
  'Lavação de muros',
  'Lavação de calçadas',
  'Montagem de móveis',
  'Instalação de cortinas',
  'Instalação de persianas',
  'Instalação de varal'
];

const LISTA_DIFERENCIAIS = [
  'Atendimento rápido',
  'Orçamento via WhatsApp',
  'Preço justo',
  'Profissional de confiança',
  'Economia de tempo'
];

const LISTA_PUBLICO = [
  'Proprietários de casas',
  'Moradores de apartamentos',
  'Condomínios',
  'Pequenos comércios'
];

function NewProjectForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createProject, templates } = useVideoStudioStore();

  const isTemplateRequested = searchParams.get('template') === 'template-institucional';
  
  const defaultValues: BriefingFormValues = isTemplateRequested ? {
    companyName: 'Click Marido Reparos Residenciais',
    segment: 'Reparos e Manutenção Residencial',
    services: ['Troca de torneiras', 'Troca de tomadas', 'Instalação de chuveiros', 'Montagem de móveis', 'Instalação de varal'],
    targetAudience: 'Proprietários de casas, Moradores de apartamentos e Condomínios',
    differentials: ['Atendimento rápido', 'Orçamento via WhatsApp', 'Preço justo', 'Profissional de confiança', 'Economia de tempo'],
    videoObjective: 'Apresentação institucional da empresa com foco em economia de tempo.',
    duration: 30
  } : {
    companyName: 'Click Marido Reparos Residenciais',
    segment: 'Reparos e Manutenção Residencial',
    services: [],
    targetAudience: 'Proprietários de casas e Moradores de apartamentos',
    differentials: [],
    videoObjective: '',
    duration: 30
  };

  const { register, handleSubmit, control, setValue, watch, formState: { errors, isSubmitting } } = useForm<BriefingFormValues>({
    resolver: zodResolver(briefingSchema),
    defaultValues
  });

  const selectedServices = watch('services') || [];
  const selectedDifferentials = watch('differentials') || [];

  const handleLoadTemplate = () => {
    const template = templates.find(t => t.id === 'template-institucional');
    if (template) {
      setValue('companyName', template.briefing.companyName);
      setValue('segment', template.briefing.segment);
      setValue('services', template.briefing.services);
      setValue('targetAudience', template.briefing.targetAudience);
      setValue('differentials', template.briefing.differentials);
      setValue('videoObjective', 'Apresentação geral da Click Marido destacando que resolvemos pequenos problemas com agilidade e preço justo.');
      setValue('duration', template.briefing.duration);
    }
  };

  const toggleService = (service: string) => {
    const current = [...selectedServices];
    const index = current.indexOf(service);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(service);
    }
    setValue('services', current, { shouldValidate: true });
  };

  const toggleDifferential = (diff: string) => {
    const current = [...selectedDifferentials];
    const index = current.indexOf(diff);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(diff);
    }
    setValue('differentials', current, { shouldValidate: true });
  };

  const onSubmit = async (values: BriefingFormValues) => {
    try {
      const project = await createProject(values as Briefing);
      router.push(`/projects/${project.id}`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Voltar */}
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar para o Painel
      </Link>

      {/* Titulo e Atalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Criar Novo Projeto
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Preencha o briefing abaixo para alimentar o gerador de IA.
          </p>
        </div>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={handleLoadTemplate}
          className="flex items-center gap-2 border-blue-500/30 hover:border-blue-500/80 text-blue-400 bg-blue-500/5 hover:bg-blue-500/10 font-semibold text-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Carregar Click Marido Institucional
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border-zinc-900">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <Wrench className="w-5 h-5 text-blue-500" />
              Briefing da Empresa
            </CardTitle>
            <CardDescription>
              Dados gerais sobre o negócio e objetivos da campanha de Reels.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Nome da Empresa e Segmento */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300">Nome da Empresa</label>
                <input
                  {...register('companyName')}
                  className="w-full h-10 px-3 rounded-md bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Ex: Click Marido Reparos Residenciais"
                />
                {errors.companyName && <p className="text-xs text-red-500 font-semibold">{errors.companyName.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300">Segmento</label>
                <input
                  {...register('segment')}
                  className="w-full h-10 px-3 rounded-md bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Ex: Reparos Residenciais"
                />
                {errors.segment && <p className="text-xs text-red-500 font-semibold">{errors.segment.message}</p>}
              </div>
            </div>

            {/* Serviços Oferecidos */}
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <label className="text-sm font-semibold text-zinc-300">Serviços Oferecidos no Vídeo</label>
                <span className="text-xxs text-zinc-500">Selecione pelo menos um</span>
              </div>
              <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 max-h-60 overflow-y-auto p-3 bg-zinc-950 rounded-lg border border-zinc-900">
                {LISTA_SERVICOS.map(service => {
                  const isChecked = selectedServices.includes(service);
                  return (
                    <button
                      key={service}
                      type="button"
                      onClick={() => toggleService(service)}
                      className={`flex items-center justify-start text-left px-3 py-2 rounded-md text-xs transition-all border font-medium cursor-pointer ${
                        isChecked 
                          ? 'bg-blue-600/10 border-blue-500 text-white' 
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {service}
                    </button>
                  );
                })}
              </div>
              {errors.services && <p className="text-xs text-red-500 font-semibold">{errors.services.message}</p>}
            </div>

            {/* Público Alvo */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-300">Público-alvo Principal</label>
              <input
                {...register('targetAudience')}
                className="w-full h-10 px-3 rounded-md bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Ex: Proprietários de casas, moradores de apartamentos"
              />
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {LISTA_PUBLICO.map(publico => (
                  <Badge
                    key={publico}
                    variant="outline"
                    className="cursor-pointer hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                    onClick={() => setValue('targetAudience', publico, { shouldValidate: true })}
                  >
                    {publico}
                  </Badge>
                ))}
              </div>
              {errors.targetAudience && <p className="text-xs text-red-500 font-semibold">{errors.targetAudience.message}</p>}
            </div>

            {/* Diferenciais */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-zinc-300">Diferenciais da Click Marido</label>
              <div className="flex flex-wrap gap-2">
                {LISTA_DIFERENCIAIS.map(diff => {
                  const isChecked = selectedDifferentials.includes(diff);
                  return (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => toggleDifferential(diff)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-blue-600/10 border-blue-500 text-white'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {diff}
                    </button>
                  );
                })}
              </div>
              {errors.differentials && <p className="text-xs text-red-500 font-semibold">{errors.differentials.message}</p>}
            </div>

            {/* Objetivo do Vídeo */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-300">Objetivo Específico do Vídeo</label>
              <textarea
                {...register('videoObjective')}
                rows={3}
                className="w-full p-3 rounded-md bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                placeholder="Ex: Divulgar serviço de troca de torneiras e encanamento para o inverno, mostrando agilidade..."
              />
              {errors.videoObjective && <p className="text-xs text-red-500 font-semibold">{errors.videoObjective.message}</p>}
            </div>

            {/* Duração e Ações */}
            <div className="grid gap-6 sm:grid-cols-2 pt-4 border-t border-zinc-900">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300">Duração Estimada do Reel</label>
                <Controller
                  name="duration"
                  control={control}
                  render={({ field }) => (
                    <div className="flex gap-2">
                      {[15, 30, 60].map(secs => (
                        <button
                          key={secs}
                          type="button"
                          onClick={() => field.onChange(secs)}
                          className={`flex-1 h-10 rounded-md border text-sm font-bold cursor-pointer transition-all ${
                            field.value === secs
                              ? 'bg-blue-600/10 border-blue-500 text-white'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          {secs} Segundos
                        </button>
                      ))}
                    </div>
                  )}
                />
              </div>

              <div className="flex items-end">
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full flex items-center justify-center gap-2 font-bold shadow-md shadow-blue-500/10 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  {isSubmitting ? 'Iniciando...' : 'Gerar Roteiro e Mídias'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

export default function NewProjectPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-zinc-400">Carregando formulário...</div>}>
      <NewProjectForm />
    </Suspense>
  );
}
