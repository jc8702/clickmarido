# Backlog de Tarefas: Click Marido Marketing Studio

Este documento contém o backlog detalhado de tarefas necessárias para implementar o sistema de locução automática por voz, animação/lipsync de personagens, e suporte a múltiplos uploads de fotos mapeadas a cenas específicas.

## 🛠️ Grupo 1: Configurações e Infraestrutura
- [x] **Tarefa 1.1:** Configurar chaves no arquivo `.env.local` (ElevenLabs configurado com a chave real, Supabase Storage e desativação do Redis para usar Supabase Queue).
- [x] **Tarefa 1.2:** Estender a página de Configurações ([settings/page.tsx](file:///c:/Users/jc-pr/.gemini/antigravity/scratch/clickmarido/src/app/settings/page.tsx)) para suportar a gravação das chaves de ElevenLabs no `localStorage` como fallback.
- [x] **Tarefa 1.3:** Configurar o bucket público `project-images` no Supabase Storage para uploads de assets de voz e vídeo.

## 🎙️ Grupo 2: Geração de Áudio (Locução TTS)
- [x] **Tarefa 2.1:** Implementar a lógica de integração no `elevenlabs-provider.ts` para converter o roteiro gerado em áudio de alta qualidade em português.
- [x] **Tarefa 2.2:** Criar uma rota de API backend `/api/tts` para gerar o áudio a partir do texto do roteiro de cada cena.
- [x] **Tarefa 2.3:** Salvar o arquivo de áudio gerado no Supabase Storage e associar a URL resultante ao projeto no banco de dados.

## 🎬 Grupo 3: Animação e Lipsync das Fotos (Provedor Gratuito)
- [x] **Tarefa 3.1:** Implementar/Ativar o `VeoProvider` para gerar vídeos de movimento de 5 segundos com base na imagem estática de referência e no prompt do storyboard.
- [x] **Tarefa 3.2:** Integrar a chamada de sincronização labial utilizando o `Wav2LipProvider` local/mockado na fila assíncrona, configurando o endpoint local do docker/colab (`http://localhost:8000`).
- [x] **Tarefa 3.3:** Encadear estas chamadas na fila de processamento assíncrono (workers em [src/workers/index.ts](file:///c:/Users/jc-pr/.gemini/antigravity/scratch/clickmarido/src/workers/index.ts)) via backend nativo do Supabase Queue.

## 🖼️ Grupo 4: Interface do Usuário e Timeline (Múltiplas Fotos)
- [x] **Tarefa 4.1:** Ajustar a UI de uploads em [projects/[id]/page.tsx](file:///c:/Users/jc-pr/.gemini/antigravity/scratch/clickmarido/src/app/projects/%5Bid%5D/page.tsx) para que o usuário associe explicitamente cada imagem carregada a uma cena do storyboard (ex: Cena 1 a 5).
- [x] **Tarefa 4.2:** Modificar o renderizador local em [video-generator.ts](file:///c:/Users/jc-pr/.gemini/antigravity/scratch/clickmarido/src/services/video/video-generator.ts) para usar o mapeamento explícito das fotos carregadas correspondentes a cada cena, sem repetição circular genérica.
- [x] **Tarefa 4.3:** Ajustar a renderização do FFmpeg no backend ([video-compositor.ts](file:///c:/Users/jc-pr/.gemini/antigravity/scratch/clickmarido/src/services/video/video-compositor.ts)) para sincronizar e misturar os clipes de vídeo gerados pela IA com a voz narrada e a música de fundo.
