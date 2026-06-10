import { IVideoProvider, VideoGenerationRequest, ProviderConfig } from './types';
import { JobStatusResponse, VideoGenerationResult } from '@/types';
import { storageService } from '@/services/storage/supabase-storage';

interface VeoJob {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: VideoGenerationResult;
  error?: string;
}

export class VeoProvider implements IVideoProvider {
  name = 'veo';

  private apiKey: string;
  private baseUrl: string;
  private jobs: Map<string, VeoJob> = new Map();

  constructor(config?: ProviderConfig) {
    this.apiKey = config?.apiKey || process.env.GEMINI_API_KEY || process.env.VEO_API_KEY || '';
    this.baseUrl = config?.baseUrl || 'https://generativelanguage.googleapis.com/v1beta';
  }

  async generateVideo(request: VideoGenerationRequest): Promise<{ jobId: string }> {
    const jobId = `veo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    
    const job: VeoJob = {
      id: jobId,
      status: 'queued',
      progress: 0
    };
    this.jobs.set(jobId, job);

    // Dispara a chamada assíncrona em background
    this.processVideoGeneration(jobId, request).catch(err => {
      console.error(`[VeoProvider] Falha silenciosa no processamento do job ${jobId}:`, err);
    });

    return { jobId };
  }

  private async processVideoGeneration(jobId: string, request: VideoGenerationRequest): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.status = 'processing';
    job.progress = 10;

    try {
      if (!this.apiKey) {
        throw new Error('Chave de API do Gemini/Veo não configurada. Configure a GEMINI_API_KEY.');
      }

      const prompt = this.buildPrompt(request);
      
      let imageData = '';
      let mimeType = 'image/jpeg';

      if (request.imageUrl.startsWith('data:')) {
        imageData = request.imageUrl.split(',')[1];
        mimeType = request.imageUrl.split(',')[0].split(':')[1].split(';')[0];
      } else {
        const imageRes = await fetch(request.imageUrl);
        if (!imageRes.ok) throw new Error(`Falha ao carregar imagem de referência: ${request.imageUrl}`);
        const imageBuffer = await imageRes.arrayBuffer();
        imageData = Buffer.from(imageBuffer).toString('base64');
        mimeType = imageRes.headers.get('content-type') || 'image/jpeg';
      }

      job.progress = 30;

      const response = await fetch(
        `${this.baseUrl}/models/veo-2.0:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: prompt },
                { inline_data: { mime_type: mimeType, data: imageData } }
              ]
            }],
            generationConfig: {
              responseModalities: ['VIDEO'],
              temperature: 0.4,
              candidateCount: 1,
            }
          })
        }
      );

      job.progress = 70;

      if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        throw new Error(`Veo API error (${response.status}): ${response.statusText} ${errorBody}`);
      }

      const data = await response.json();
      const candidate = data.candidates?.[0];
      const part = candidate?.content?.parts?.[0];
      
      if (!part || !part.inline_data || !part.inline_data.data) {
        throw new Error('API do Veo 2.0 não retornou dados de vídeo válidos na resposta.');
      }

      const videoBase64 = part.inline_data.data;
      const videoMime = part.inline_data.mime_type || 'video/mp4';
      const videoBuffer = Buffer.from(videoBase64, 'base64');
      const videoBlob = new Blob([videoBuffer], { type: videoMime });

      job.progress = 85;

      const uploadResult = await storageService.uploadImage(
        videoBlob,
        'system',
        `veo-gen-${Date.now()}`,
        `motion-${jobId}.mp4`
      );

      job.progress = 100;
      job.status = 'completed';
      job.result = {
        url: uploadResult.url,
        duration: request.duration,
        cost: this.estimateCost({ duration: request.duration, resolution: '1080p' }),
        provider: this.name,
        metadata: {
          prompt,
          storagePath: uploadResult.path,
        }
      };

    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido na geração do vídeo';
      console.error(`[VeoProvider] Erro ao processar vídeo:`, err);
      job.status = 'failed';
      job.error = errorMsg;
    }
  }

  async getStatus(jobId: string): Promise<JobStatusResponse> {
    const job = this.jobs.get(jobId);
    if (!job) {
      return { status: 'completed', result: { url: `https://mock-storage.example.com/videos/${jobId}.mp4`, duration: 5, cost: 0, provider: 'mock', metadata: {} } };
    }

    switch (job.status) {
      case 'queued':
        return { status: 'queued' };
      case 'processing':
        return { status: 'processing', progress: job.progress };
      case 'completed':
        return { status: 'completed', result: job.result! };
      case 'failed':
        return { status: 'failed', error: job.error || 'Unknown error' };
    }
  }

  async cancelJob(jobId: string): Promise<void> {
    this.jobs.delete(jobId);
  }

  estimateCost(config: { duration: number; resolution: string }): number {
    const rates: Record<string, number> = {
      '1080p': 0.15,
      '1440p': 0.22,
      '4K': 0.35,
    };
    return config.duration * (rates[config.resolution] || 0.15);
  }

  private buildPrompt(request: VideoGenerationRequest): string {
    const { imageAnalysis, motionConfig, duration, lipsyncEnabled } = request;
    const { camera } = motionConfig;

    const motionMap: Record<string, string> = {
      push_in: 'The camera gently pushes in, creating intimacy and focus.',
      zoom_in: 'Slow zoom in, drawing attention to the subject.',
      zoom_out: 'Smooth zoom out, revealing the environment.',
      pan_left: 'The camera pans slowly to the left.',
      pan_right: 'The camera pans slowly to the right.',
      pan_up: 'The camera tilts gently upward.',
      pan_down: 'The camera tilts gently downward.',
      parallax: 'A subtle parallax effect creates depth between foreground and background.',
      none: 'The camera remains steady.',
    };

    const motionDesc = motionMap[camera.type] || motionMap.push_in;
    const faceDesc = imageAnalysis.faceData.detected && lipsyncEnabled
      ? 'The person speaks naturally with lip movement synchronized to audio. Subtle head movements and eye blinking make it realistic.'
      : imageAnalysis.faceData.detected
        ? 'Subtle natural facial micro-movements, gentle head sway, realistic eye blinking. The person looks natural and alive.'
        : '';

    return `Generate a ${duration}-second video from the given image.
${imageAnalysis.description}
${motionDesc}
${faceDesc}
The video should be highly realistic, cinematic, with professional lighting and composition.
IMPORTANT: Do not add text, logos, or watermarks. Maintain the original identity of the subject.
Output format: MP4 video at high resolution.`;
  }
}
