import { create } from 'zustand';
import { Project, Briefing, VideoTemplate, ProjectImage, GeneratedVideo } from '@/types';
import { AIService } from '@/services/ai/ai-service';
import { VideoGenerator as LocalVideoGenerator } from '@/services/video/video-generator';

interface VideoStudioState {
  projects: Project[];
  templates: VideoTemplate[];
  currentProject: Project | null;
  isLoading: boolean;
  isGeneratingVideo: boolean;
  error: string | null;

  createProject: (briefing: Briefing) => Promise<Project>;
  generateContentForProject: (projectId: string) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
  deleteProject: (projectId: string) => void;
  loadInitialData: () => void;
  addImage: (projectId: string, image: ProjectImage) => void;
  removeImage: (projectId: string, imageId: string) => void;
  generateVideo: (projectId: string) => Promise<void>;
  generateVideoIA: (projectId: string) => Promise<void>;
}

const TEMPLATE_CLICK_MARIDO_INSTITUCIONAL: VideoTemplate = {
  id: 'template-institucional',
  name: 'Click Marido Institucional',
  description: 'Apresentação geral da empresa destacando facilidade, profissional de confiança e orçamento rápido por WhatsApp.',
  briefing: {
    companyName: 'Click Marido Reparos Residenciais',
    segment: 'Reparos e Manutenção Residencial',
    services: [
      'Troca de torneiras',
      'Troca de tomadas',
      'Instalação de chuveiros',
      'Montagem de móveis',
      'Instalação de varal'
    ],
    targetAudience: 'Proprietários de casas, Moradores de apartamentos e Condomínios',
    differentials: [
      'Atendimento rápido',
      'Orçamento via WhatsApp',
      'Preço justo',
      'Profissional de confiança',
      'Economia de tempo'
    ],
    videoObjective: 'Apresentação da empresa e geração de leads via WhatsApp',
    duration: 30
  }
};

const INITIAL_PROJECT_MOCK: Project = {
  id: 'proj-1',
  name: 'Click Marido Institucional - Campanha Junho',
  createdAt: new Date().toISOString(),
  status: 'completed',
  briefing: TEMPLATE_CLICK_MARIDO_INSTITUCIONAL.briefing,
  script: {
    hook: '🚨 Cansado de acumular pequenos consertos em casa? Conheça o Click Marido!',
    scene1: 'Mostra uma pessoa frustrada tentando consertar uma torneira vazando e se molhando inteira.',
    scene2: 'Cena rápida: profissional do Click Marido de uniforme azul chega sorridente com ferramentas adequadas.',
    scene3: 'A torneira é trocada perfeitamente e o cliente sorri aliviado testando a torneira nova.',
    cta: '📲 Resolva tudo com um único profissional de confiança. Clique no link da bio e peça seu orçamento via WhatsApp!'
  },
  storyboard: [
    {
      scene: 'Cena 1 - O Gancho',
      camera: 'Plano médio, foco na expressão irritada do dono da casa.',
      environment: 'Cozinha comum, iluminação do dia.',
      action: 'O homem tenta apertar a torneira com um alicate comum, a água espirra na cara dele.',
      duration: '5 segundos'
    },
    {
      scene: 'Cena 2 - A Dor',
      camera: 'Plano fechado no vazamento contínuo da torneira pingando.',
      environment: 'Cozinha, pia com pratos.',
      action: 'A pessoa desiste, solta a ferramenta e pega o celular com cara de preocupação.',
      duration: '5 segundos'
    },
    {
      scene: 'Cena 3 - A Solução',
      camera: 'Plano de detalhe no profissional do Click Marido chegando.',
      environment: 'Entrada da casa, iluminação clara.',
      action: 'Profissional de uniforme limpo toca a campainha, trazendo uma maleta de ferramentas moderna.',
      duration: '7 segundos'
    },
    {
      scene: 'Cena 4 - O Trabalho',
      camera: 'Corte rápido, close-up nas mãos do técnico instalando a torneira.',
      environment: 'Pia da cozinha.',
      action: 'Ele passa veda rosca com agilidade, rosqueia a torneira nova e aperta perfeitamente.',
      duration: '6 segundos'
    },
    {
      scene: 'Cena 5 - CTA',
      camera: 'Plano médio do profissional e do cliente dando um aperto de mão amigável.',
      environment: 'Cozinha limpa.',
      action: 'A torneira funciona perfeitamente. Aparece o logotipo Click Marido com animação de contato do WhatsApp.',
      duration: '7 segundos'
    }
  ],
  prompts: [
    {
      scene: 'Cena 1 - O Gancho',
      prompt: 'Cinematic medium shot of a frustrated man in a modern kitchen, trying to fix a leaking chrome kitchen faucet with a basic wrench, water splashing on his face, realistic cinematic lighting, depth of field.',
      negativePrompt: 'low quality, blurry, deformed hands, cartoon, 3D render, drawing, text, logo'
    },
    {
      scene: 'Cena 2 - A Dor',
      prompt: 'Detailed close-up of a shiny kitchen faucet leaking water droplets in slow motion, shallow depth of field, natural indoor lighting, photorealistic textures.',
      negativePrompt: 'low quality, 3D render, cartoon, digital art'
    },
    {
      scene: 'Cena 3 - A Solução',
      prompt: 'A friendly professional Brazilian handyman wearing a clean blue uniform and carrying a black toolcase, standing at a bright apartment door smiling, welcoming atmosphere.',
      negativePrompt: 'low quality, blurry, anime, painting, deformed face'
    },
    {
      scene: 'Cena 4 - O Trabalho',
      prompt: 'Close-up of professional repairman hands installing a brand new high-end chrome kitchen faucet, precision manual work, sharp details, studio lighting.',
      negativePrompt: 'low quality, drawing, text'
    },
    {
      scene: 'Cena 5 - CTA',
      prompt: 'Happy homeowner smiling alongside a professional handyman in a clean, modern kitchen, giving a thumbs up towards the camera, cozy lighting, commercial style.',
      negativePrompt: 'low quality, text, blurry, distorted'
    }
  ],
  caption: {
    instagramCaption: 'Chega de adiar os consertos da sua casa! 🛠️🏠\n\nCom o Click Marido, você resolve tudo o que precisa em uma única visita. Trocamos torneiras, chuveiros, tomadas, montamos móveis e muito mais. Sempre com profissional de confiança, preço justo e orçamento prático via WhatsApp.',
    whatsappCta: '📲 Clique no link da bio e fale conosco pelo WhatsApp agora mesmo!',
    hashtags: ['#ClickMarido', '#ReparosResidenciais', '#MaridoDeAluguel', '#DonaDeCasa', '#LarDoceLar', '#ConsertosRapidos']
  },
  images: [],
  video: undefined
};

function getSavedApiKey(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    return localStorage.getItem('clickmarido_gemini_key') || undefined;
  } catch {
    return undefined;
  }
}

function syncToSupabase(projects: Project[]) {
  projects.forEach(p => {
    fetch(`/api/projects/${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p),
    }).catch(err => console.error('Erro ao sincronizar projeto com a API:', err));
  });
}

export const useVideoStudioStore = create<VideoStudioState>((set, get) => ({
  projects: [],
  templates: [TEMPLATE_CLICK_MARIDO_INSTITUCIONAL],
  currentProject: null,
  isLoading: false,
  isGeneratingVideo: false,
  error: null,

  loadInitialData: () => {
    const stored = localStorage.getItem('clickmarido_projects');
    if (stored) {
      try {
        set({ projects: JSON.parse(stored) });
      } catch {
        set({ projects: [INITIAL_PROJECT_MOCK] });
      }
    } else {
      set({ projects: [INITIAL_PROJECT_MOCK] });
      localStorage.setItem('clickmarido_projects', JSON.stringify([INITIAL_PROJECT_MOCK]));
      syncToSupabase([INITIAL_PROJECT_MOCK]);
    }
  },

  createProject: async (briefing: Briefing): Promise<Project> => {
    set({ isLoading: true, error: null });

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: `${briefing.companyName} - ${briefing.videoObjective.slice(0, 25)}...`,
      createdAt: new Date().toISOString(),
      status: 'generating',
      briefing,
      images: [],
      video: undefined
    };

    set(state => {
      const updated = [newProject, ...state.projects];
      localStorage.setItem('clickmarido_projects', JSON.stringify(updated));
      syncToSupabase(updated);
      return {
        projects: updated,
        currentProject: newProject
      };
    });

    setTimeout(async () => {
      await get().generateContentForProject(newProject.id);
    }, 200);

    set({ isLoading: false });
    return newProject;
  },

  generateContentForProject: async (projectId: string): Promise<void> => {
    const project = get().projects.find(p => p.id === projectId);
    if (!project) return;

    set(state => ({
      projects: state.projects.map(p => p.id === projectId ? { ...p, status: 'generating' } : p),
      currentProject: state.currentProject?.id === projectId ? { ...state.currentProject, status: 'generating' } : state.currentProject
    }));

    try {
      const apiKey = getSavedApiKey();
      let script, storyboard, prompts, caption;

      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            briefing: project.briefing,
            apiKey: apiKey || undefined
          })
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            script = result.data.script;
            storyboard = result.data.storyboard;
            prompts = result.data.prompts;
            caption = result.data.caption;
          } else {
            throw new Error(result.error || 'API route failed');
          }
        } else {
          throw new Error(`API responded with ${response.status}`);
        }
      } catch (apiError) {
        console.warn('API route unavailable, using local AIService:', apiError);
        script = await AIService.generateScript(project.briefing, apiKey);
        storyboard = await AIService.generateStoryboard(project.briefing, script, apiKey);
        prompts = await AIService.generateVideoPrompts(project.briefing, storyboard, apiKey);
        caption = await AIService.generateCaption(project.briefing, script, apiKey);
      }

      set(state => {
        const updatedProjects = state.projects.map(p =>
          p.id === projectId
            ? { ...p, script, storyboard, prompts, caption, status: 'completed' as const }
            : p
        );
        localStorage.setItem('clickmarido_projects', JSON.stringify(updatedProjects));
        syncToSupabase(updatedProjects);

        const nextCurrent = updatedProjects.find(p => p.id === projectId) || null;
        return {
          projects: updatedProjects,
          currentProject: state.currentProject?.id === projectId ? nextCurrent : state.currentProject
        };
      });
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'Falha ao gerar conteúdo';
      set(state => ({
        error: errorMessage,
        projects: state.projects.map(p => p.id === projectId ? { ...p, status: 'failed' as const } : p),
        currentProject: state.currentProject?.id === projectId ? { ...state.currentProject, status: 'failed' as const } : state.currentProject
      }));
    }
  },

  setCurrentProject: (project: Project | null) => {
    set({ currentProject: project });
  },

  deleteProject: (projectId: string) => {
    set(state => {
      const updated = state.projects.filter(p => p.id !== projectId);
      localStorage.setItem('clickmarido_projects', JSON.stringify(updated));
      syncToSupabase(updated);
      return {
        projects: updated,
        currentProject: state.currentProject?.id === projectId ? null : state.currentProject
      };
    });
  },

  addImage: (projectId: string, image: ProjectImage) => {
    set(state => {
      const updatedProjects = state.projects.map(p => {
        if (p.id !== projectId) return p;
        return { ...p, images: [...(p.images || []), image] };
      });
      localStorage.setItem('clickmarido_projects', JSON.stringify(updatedProjects));
      syncToSupabase(updatedProjects);
      return {
        projects: updatedProjects,
        currentProject: state.currentProject?.id === projectId
          ? updatedProjects.find(p => p.id === projectId) || null
          : state.currentProject
      };
    });
  },

  removeImage: (projectId: string, imageId: string) => {
    set(state => {
      const updatedProjects = state.projects.map(p => {
        if (p.id !== projectId) return p;
        return { ...p, images: (p.images || []).filter(img => img.id !== imageId) };
      });
      localStorage.setItem('clickmarido_projects', JSON.stringify(updatedProjects));
      syncToSupabase(updatedProjects);
      return {
        projects: updatedProjects,
        currentProject: state.currentProject?.id === projectId
          ? updatedProjects.find(p => p.id === projectId) || null
          : state.currentProject
      };
    });
  },

  generateVideo: async (projectId: string) => {
    const project = get().projects.find(p => p.id === projectId);
    if (!project || !project.script || !project.storyboard) return;

    set({ isGeneratingVideo: true, error: null });

    set(state => ({
      projects: state.projects.map(p =>
        p.id === projectId
          ? { ...p, video: { url: '', prompt: '', status: 'pending' as const, createdAt: new Date().toISOString() } as GeneratedVideo }
          : p
      ),
      currentProject: state.currentProject?.id === projectId
        ? { ...state.currentProject, video: { url: '', prompt: '', status: 'pending' as const, createdAt: new Date().toISOString() } as GeneratedVideo }
        : state.currentProject
    }));

    try {
      const generator = new LocalVideoGenerator();
      const blob = await generator.generate(
        project.images || [],
        project.script,
        project.storyboard
      );

      if (blob) {
        const url = URL.createObjectURL(blob);

        set(state => {
          const updatedProjects = state.projects.map(p =>
            p.id === projectId
              ? {
                  ...p,
                  video: {
                    url,
                    prompt: project.script?.hook || '',
                    status: 'completed' as const,
                    createdAt: new Date().toISOString()
                  }
                }
              : p
          );
          localStorage.setItem('clickmarido_projects', JSON.stringify(updatedProjects));
          syncToSupabase(updatedProjects);
          return {
            projects: updatedProjects,
            currentProject: state.currentProject?.id === projectId
              ? updatedProjects.find(p => p.id === projectId) || null
              : state.currentProject,
            isGeneratingVideo: false
          };
        });
      } else {
        throw new Error('Falha ao gerar vídeo');
      }
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'Falha ao gerar vídeo';
      set(state => ({
        error: errorMessage,
        isGeneratingVideo: false,
        projects: state.projects.map(p =>
          p.id === projectId
            ? { ...p, video: undefined }
            : p
        ),
        currentProject: state.currentProject?.id === projectId
          ? { ...state.currentProject, video: undefined }
          : state.currentProject
      }));
    }
  },

  generateVideoIA: async (projectId: string) => {
    const project = get().projects.find(p => p.id === projectId);
    if (!project || !project.script || !project.storyboard) return;

    set({ isGeneratingVideo: true, error: null });

    set(state => {
      const updated = state.projects.map(p =>
        p.id === projectId ? { ...p, status: 'generating' as const } : p
      );
      localStorage.setItem('clickmarido_projects', JSON.stringify(updated));
      return {
        projects: updated,
        currentProject: state.currentProject?.id === projectId
          ? { ...state.currentProject, status: 'generating' as const }
          : state.currentProject
      };
    });

    try {
      const apiKey = localStorage.getItem('clickmarido_elevenlabs_key') || undefined;

      const response = await fetch(`/api/projects/${projectId}/generate-ia-video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Falha ao iniciar geração por IA: HTTP ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Falha ao iniciar geração por IA');
      }

      const pollInterval = setInterval(async () => {
        try {
          const checkRes = await fetch(`/api/projects/${projectId}`);
          if (checkRes.ok) {
            const checkData = await checkRes.json();
            if (checkData.success && checkData.data) {
              const updatedProject = checkData.data as Project;
              
              if (updatedProject.status === 'completed' || updatedProject.status === 'failed') {
                clearInterval(pollInterval);

                set(state => {
                  const updatedProjects = state.projects.map(p =>
                    p.id === projectId ? updatedProject : p
                  );
                  localStorage.setItem('clickmarido_projects', JSON.stringify(updatedProjects));
                  return {
                    projects: updatedProjects,
                    currentProject: state.currentProject?.id === projectId ? updatedProject : state.currentProject,
                    isGeneratingVideo: false,
                    error: updatedProject.status === 'failed' ? 'Geração de vídeo por IA falhou no worker' : null
                  };
                });
              }
            }
          }
        } catch (pollErr) {
          console.error('[Polling] Erro ao verificar status do projeto:', pollErr);
        }
      }, 4000);

    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'Erro na geração de vídeo por IA';
      set(state => {
        const rollbackProjects = state.projects.map(p =>
          p.id === projectId ? { ...p, status: 'completed' as const } : p
        );
        return {
          error: errorMessage,
          isGeneratingVideo: false,
          projects: rollbackProjects,
          currentProject: state.currentProject?.id === projectId
            ? { ...state.currentProject, status: 'completed' as const }
            : state.currentProject
        };
      });
    }
  }
}));
