import { Briefing, Script, StoryboardItem, VideoPromptItem, Caption } from '@/types';

// Mock Generator para simular a geração caso as chaves de API não estejam configuradas
const generateMockScript = (briefing: Briefing): Script => {
  const serviceText = briefing.services.length > 0 ? briefing.services.join(', ') : 'reparos residenciais';
  return {
    hook: `🚨 Cansado de acumular pequenos consertos em casa? Conheça o Click Marido!`,
    scene1: `Mostra uma pessoa frustrada tentando consertar algo (como ${briefing.services[0] || 'uma torneira vazando'}) e falhando.`,
    scene2: `Cena de transição rápida onde o profissional do Click Marido chega sorridente, com ferramentas profissionais, e resolve o problema rapidamente.`,
    scene3: `Mostra o serviço finalizado com perfeição (${serviceText}) e o cliente satisfeito aproveitando o tempo livre.`,
    cta: `📲 Resolva seus problemas residenciais hoje mesmo. Clique no link da bio e solicite seu orçamento via WhatsApp!`,
  };
};

const generateMockStoryboard = (_briefing: Briefing, _script: Script): StoryboardItem[] => {
  return [
    {
      scene: 'Cena 1 (Gancho)',
      camera: 'Plano médio, foco na expressão de frustração do personagem principal.',
      environment: 'Cozinha ou banheiro residencial com iluminação comum.',
      action: 'A pessoa tenta apertar um parafuso ou ajustar um cano com a ferramenta errada e a água espirra de leve. Expressão de desespero.',
      duration: '3 segundos',
    },
    {
      scene: 'Cena 2 (O Problema)',
      camera: 'Câmera lenta, close-up na peça quebrada/vazando.',
      environment: 'Mesmo ambiente anterior.',
      action: 'A pessoa coloca a mão na testa, suspira e pega o celular para buscar ajuda.',
      duration: '3 segundos',
    },
    {
      scene: 'Cena 3 (A Solução)',
      camera: 'Plano americano, ângulo levemente de baixo para cima (hero shot).',
      environment: 'Entrada da casa, iluminação clara e amigável.',
      action: 'O profissional do Click Marido chega de uniforme limpo, mala de ferramentas organizada, acenando de forma simpática.',
      duration: '4 segundos',
    },
    {
      scene: 'Cena 4 (O Serviço)',
      camera: 'Corte rápido, close-up nas mãos do profissional trabalhando com precisão.',
      environment: 'Local do reparo.',
      action: 'O profissional troca a torneira ou aperta a conexão com facilidade e ferramenta correta. A água para de vazar instantaneamente.',
      duration: '3 segundos',
    },
    {
      scene: 'Cena 5 (Chamada para Ação)',
      camera: 'Plano médio do profissional e do cliente sorrindo juntos, depois transição para a tela final com o logotipo.',
      environment: 'Casa arrumada e limpa.',
      action: 'O cliente testa o serviço e faz sinal de positivo. O profissional aponta para o celular mostrando o WhatsApp.',
      duration: '5 segundos',
    },
  ];
};

const generateMockVideoPrompts = (briefing: Briefing, storyboard: StoryboardItem[]): VideoPromptItem[] => {
  return storyboard.map((item, index) => {
    let promptText = '';
    switch (index) {
      case 0:
        promptText = `Cinematic close-up of a frustrated homeowner in a modern kitchen, trying to fix a leaking chrome faucet, water spraying, realistic lighting, 8k resolution, highly detailed, photorealistic.`;
        break;
      case 1:
        promptText = `Slightly slow motion close-up of a water drop leaking from a pipe under a sink, shallow depth of field, warm indoor lighting, professional photography style.`;
        break;
      case 2:
        promptText = `A friendly professional repairman wearing a clean blue polo shirt and carrying a structured toolbox, entering a bright modern apartment doorway, smiling, greeting client, warm sun flare, cinematic.`;
        break;
      case 3:
        promptText = `Close-up shot of professional hands using a metallic wrench tool to perfectly tighten a plumbing connection, clean work environment, detailed textures, soft studio lighting.`;
        break;
      default:
        promptText = `Happy client and a friendly handyman giving a thumbs up in a beautifully lit living room, cozy and clean home interior, cinematic colors, commercial lookup, ultra-realistic.`;
    }

    return {
      scene: item.scene,
      prompt: promptText,
      negativePrompt: `blurry, low quality, CGI, 3D render, cartoon, deformed hands, messy, dark, horror lighting, text, watermark.`,
    };
  });
};

const generateMockCaption = (briefing: Briefing, _script: Script): Caption => {
  return {
    instagramCaption: `Chega de quebrar a cabeça com reparos que você não sabe fazer! 🛠️🏠\n\nNo Click Marido, nós resolvemos tudo para você com agilidade, preço justo e profissionalismo de confiança. Desde pequenos reparos elétricos até serviços hidráulicos e montagem de móveis.\n\nDeixe a sua casa em mãos de quem entende do assunto e ganhe mais tempo livre para curtir o que realmente importa!`,
    whatsappCta: `Fale conosco agora mesmo e solicite seu orçamento rápido pelo WhatsApp! Link na bio! 📲`,
    hashtags: ['#ClickMarido', '#ReparosResidenciais', '#ManutencaoResidencial', '#MaridoDeAluguel', '#DonaDeCasa', '#LarDoceLar', '#ConsertosRapidos', ...briefing.services.map(s => `#${s.replace(/\s+/g, '')}`)].slice(0, 10),
  };
};

export class AIService {
  private static getApiKey(provider: 'gemini' | 'claude' | 'openrouter'): string | undefined {
    if (typeof window === 'undefined') {
      if (provider === 'gemini') return process.env.GEMINI_API_KEY;
      if (provider === 'claude') return process.env.CLAUDE_API_KEY;
      return process.env.OPENROUTER_API_KEY;
    }
    return undefined;
  }

  // Helper para chamar a API caso as chaves estejam configuradas
  private static async callAI(prompt: string, provider: 'gemini' | 'claude' | 'openrouter' = 'gemini'): Promise<string> {
    const key = this.getApiKey(provider);
    if (!key) {
      throw new Error('API Key não configurada');
    }

    // Exemplo de integração usando fetch direto com a API selecionada
    if (provider === 'gemini') {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      });
      if (!response.ok) {
        throw new Error(`Erro na API do Gemini: ${response.statusText}`);
      }
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }

    // Fallback genérico para OpenRouter
    const openRouterKey = this.getApiKey('openrouter') || key;
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openRouterKey}`,
        'HTTP-Referer': 'https://clickmarido.com.br',
        'X-Title': 'Click Marido Marketing Studio'
      },
      body: JSON.stringify({
        model: provider === 'claude' ? 'anthropic/claude-3-haiku' : 'google/gemini-flash-1.5',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      throw new Error(`Erro na API do OpenRouter: ${response.statusText}`);
    }
    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }

  static async generateScript(briefing: Briefing): Promise<Script> {
    try {
      const prompt = `Você é um copywriter profissional de anúncios de alta conversão para Instagram Reels.
Com base no seguinte briefing, gere um roteiro de vídeo estruturado exatamente como JSON, sem comentários ou formatação Markdown fora do bloco JSON.
O JSON deve ter exatamente esta estrutura:
{
  "hook": "frase inicial de impacto de até 5 segundos",
  "scene1": "descrição da primeira cena (o problema)",
  "scene2": "descrição da segunda cena (a transição/apresentação do serviço)",
  "scene3": "descrição da terceira cena (o resultado/benefício)",
  "cta": "chamada para ação direcionando para o WhatsApp"
}

Briefing:
- Empresa: ${briefing.companyName}
- Segmento: ${briefing.segment}
- Serviços oferecidos: ${briefing.services.join(', ')}
- Público-alvo: ${briefing.targetAudience}
- Diferenciais: ${briefing.differentials.join(', ')}
- Objetivo do vídeo: ${briefing.videoObjective}
- Duração estimada: ${briefing.duration} segundos.`;

      const responseText = await this.callAI(prompt, 'gemini');
      // Tenta fazer parse do JSON retornado da IA
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson) as Script;
    } catch (error) {
      console.warn('Usando Mock de Fallback para Roteiro:', error);
      // Retorna mock local se falhar ou se não tiver API key
      return new Promise((resolve) => setTimeout(() => resolve(generateMockScript(briefing)), 1200));
    }
  }

  static async generateStoryboard(briefing: Briefing, script: Script): Promise<StoryboardItem[]> {
    try {
      const prompt = `Com base no roteiro gerado e no briefing, crie um storyboard detalhado para cada cena do vídeo de ${briefing.duration} segundos.
Retorne um JSON contendo uma lista de objetos representando as cenas. Responda apenas com o JSON puro, sem marcações markdown adicionais.
O formato deve ser exatamente:
[
  {
    "scene": "Identificador da Cena (Ex: Cena 1 - Gancho)",
    "camera": "Instrução de câmera e enquadramento",
    "environment": "Descrição do ambiente e iluminação",
    "action": "Descrição da ação física detalhada ocorrendo",
    "duration": "Duração da cena (Ex: 3 segundos)"
  }
]

Roteiro:
- Gancho: ${script.hook}
- Cena 1 (Problema): ${script.scene1}
- Cena 2 (Transição): ${script.scene2}
- Cena 3 (Resultado): ${script.scene3}
- CTA: ${script.cta}`;

      const responseText = await this.callAI(prompt, 'gemini');
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson) as StoryboardItem[];
    } catch (error) {
      console.warn('Usando Mock de Fallback para Storyboard:', error);
      return new Promise((resolve) => setTimeout(() => resolve(generateMockStoryboard(briefing, script)), 1000));
    }
  }

  static async generateVideoPrompts(briefing: Briefing, storyboard: StoryboardItem[]): Promise<VideoPromptItem[]> {
    try {
      const prompt = `Você é um engenheiro de prompts de IA de vídeo especialista em gerar prompts cinematográficos altamente detalhados para geradores de vídeo como Gemini Veo, Kling, Runway Gen-2 ou Sora.
Com base nas seguintes cenas de storyboard, retorne um array JSON com os prompts otimizados para IA de vídeo para cada uma.
Gere termos em inglês para melhor compatibilidade com os modelos de vídeo de IA.
Estrutura do JSON a ser retornado (apenas o JSON puro):
[
  {
    "scene": "Nome da cena original",
    "prompt": "Prompt em inglês detalhado (camera, lighting, action, quality keywords)",
    "negativePrompt": "Lado negativo do prompt (ex: blurry, deformed, cartoon)"
  }
]

Storyboard:
${JSON.stringify(storyboard, null, 2)}`;

      const responseText = await this.callAI(prompt, 'gemini');
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson) as VideoPromptItem[];
    } catch (error) {
      console.warn('Usando Mock de Fallback para Prompts de Vídeo:', error);
      return new Promise((resolve) => setTimeout(() => resolve(generateMockVideoPrompts(briefing, storyboard)), 800));
    }
  }

  static async generateCaption(briefing: Briefing, script: Script): Promise<Caption> {
    try {
      const prompt = `Gere uma legenda de Instagram profissional e persuasiva com base no roteiro do vídeo.
Retorne um objeto JSON contendo o texto da legenda, um CTA direto para o WhatsApp e hashtags relevantes.
Retorne apenas o JSON puro, sem markdown extra.
Estrutura:
{
  "instagramCaption": "texto da legenda estruturado com espaçamentos e emojis",
  "whatsappCta": "CTA curto com número ou menção ao link na bio",
  "hashtags": ["lista", "de", "hashtags", "sem", "o", "simbolo", "de", "jogo", "da", "velha"]
}

Roteiro:
- Gancho: ${script.hook}
- Corpo: ${script.scene1} | ${script.scene2} | ${script.scene3}
- CTA original: ${script.cta}`;

      const responseText = await this.callAI(prompt, 'gemini');
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson) as Caption;
    } catch (error) {
      console.warn('Usando Mock de Fallback para Legenda:', error);
      return new Promise((resolve) => setTimeout(() => resolve(generateMockCaption(briefing, script)), 500));
    }
  }
}
