import { create } from 'zustand';
import { Project, Briefing, VideoTemplate } from '@/types';
import { AIService } from '@/services/ai/ai-service';

interface VideoStudioState {
  projects: Project[];
  templates: VideoTemplate[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  
  createProject: (briefing: Briefing) => Promise<Project>;
  generateContentForProject: (projectId: string) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
  deleteProject: (projectId: string) => void;
  loadInitialData: () => void;
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
  }
};

export const useVideoStudioStore = create<VideoStudioState>((set, get) => ({
  projects: [],
  templates: [TEMPLATE_CLICK_MARIDO_INSTITUCIONAL],
  currentProject: null,
  isLoading: false,
  error: null,

  loadInitialData: () => {
    // Carrega dados iniciais fictícios para visualização premium imediata
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
    }
  },

  createProject: async (briefing: Briefing): Promise<Project> => {
    set({ isLoading: true, error: null });
    
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: `${briefing.companyName} - ${briefing.videoObjective.slice(0, 25)}...`,
      createdAt: new Date().toISOString(),
      status: 'generating',
      briefing
    };

    set(state => {
      const updated = [newProject, ...state.projects];
      localStorage.setItem('clickmarido_projects', JSON.stringify(updated));
      return { 
        projects: updated,
        currentProject: newProject
      };
    });

    // Inicia geração assíncrona
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
      // 1. Gera o Roteiro
      const script = await AIService.generateScript(project.briefing);
      
      // 2. Gera o Storyboard
      const storyboard = await AIService.generateStoryboard(project.briefing, script);
      
      // 3. Gera os Prompts de Vídeo
      const prompts = await AIService.generateVideoPrompts(project.briefing, storyboard);
      
      // 4. Gera a Legenda
      const caption = await AIService.generateCaption(project.briefing, script);

      set(state => {
        const updatedProjects = state.projects.map(p => 
          p.id === projectId 
            ? { ...p, script, storyboard, prompts, caption, status: 'completed' as const } 
            : p
        );
        localStorage.setItem('clickmarido_projects', JSON.stringify(updatedProjects));
        
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
      return {
        projects: updated,
        currentProject: state.currentProject?.id === projectId ? null : state.currentProject
      };
    });
  }
}));
