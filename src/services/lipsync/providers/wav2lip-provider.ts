import { ILipSyncProvider, LipSyncProviderName } from '../types';
import { LipSyncRequest } from '@/types';

interface LocalJob {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  outputUrl?: string;
  error?: string;
}

export class Wav2LipProvider implements ILipSyncProvider {
  name: LipSyncProviderName = 'wav2lip';

  private apiUrl: string;
  private apiKey: string;
  private localJobs: Map<string, LocalJob> = new Map();

  constructor(config?: { apiUrl?: string; apiKey?: string }) {
    this.apiUrl = config?.apiUrl || process.env.WAV2LIP_API_URL || 'http://localhost:8000';
    this.apiKey = config?.apiKey || process.env.WAV2LIP_API_KEY || '';
  }

  async sync(request: LipSyncRequest): Promise<{ jobId: string }> {
    const isMockMode = process.env.WAV2LIP_MOCK === 'true';

    if (!isMockMode) {
      try {
        const formData = new FormData();

        const videoResponse = await fetch(request.videoUrl);
        if (!videoResponse.ok) throw new Error('Falha ao baixar vídeo de entrada');
        const videoBlob = await videoResponse.blob();
        formData.append('video', videoBlob, 'input.mp4');

        const audioResponse = await fetch(request.audioUrl);
        if (!audioResponse.ok) throw new Error('Falha ao baixar áudio de entrada');
        const audioBlob = await audioResponse.blob();
        formData.append('audio', audioBlob, 'audio.wav');

        formData.append('pads', '0 0 0 0');
        formData.append('nosync', 'false');
        formData.append('outfile', 'output.mp4');

        if (this.apiKey) {
          formData.append('api_key', this.apiKey);
        }

        const response = await fetch(`${this.apiUrl}/sync`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          return { jobId: data.job_id || data.id || `wav2lip-${Date.now()}` };
        }
      } catch (err) {
        console.warn('[Wav2LipProvider] Falha ao comunicar com o servidor real, caindo de volta para o simulador local:', err);
      }
    }

    // Modo Mock/Simulador Local (Fallback)
    const jobId = `wav2lip-mock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const job: LocalJob = {
      id: jobId,
      status: 'queued',
      progress: 0
    };
    this.localJobs.set(jobId, job);

    // Simula o processamento assíncrono
    setTimeout(() => {
      job.status = 'processing';
      let progress = 0;
      const interval = setInterval(() => {
        progress += 25;
        job.progress = progress;
        if (progress >= 100) {
          clearInterval(interval);
          job.status = 'completed';
          job.outputUrl = request.videoUrl; // Retorna o mesmo vídeo de entrada para fins de teste
        }
      }, 1000);
    }, 500);

    return { jobId };
  }

  async getStatus(jobId: string) {
    if (jobId.startsWith('wav2lip-mock-') || this.localJobs.has(jobId)) {
      const job = this.localJobs.get(jobId);
      if (!job) {
        return { status: 'failed' as const, error: 'Job não encontrado' };
      }
      if (job.status === 'queued') return { status: 'queued' as const };
      if (job.status === 'processing') return { status: 'processing' as const, progress: job.progress };
      if (job.status === 'completed') {
        return {
          status: 'completed' as const,
          result: {
            videoUrl: job.outputUrl || '',
            duration: 5,
            cost: 0,
            provider: this.name,
          }
        };
      }
      return { status: 'failed' as const, error: job.error || 'Erro no job simulado' };
    }

    try {
      const response = await fetch(`${this.apiUrl}/jobs/${jobId}/status`, {
        headers: this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {},
      });

      if (!response.ok) {
        return { status: 'failed' as const, error: `HTTP ${response.status}` };
      }

      const data = await response.json();
      const status = data.status as string;
      if (status === 'pending' || status === 'queued') return { status: 'queued' as const };
      if (status === 'processing') return { status: 'processing' as const, progress: data.progress || 50 };
      if (status === 'completed') {
        return {
          status: 'completed' as const,
          result: {
            videoUrl: data.output_url || data.result_url || data.url,
            duration: data.duration || 5,
            cost: 0,
            provider: this.name,
            metadata: data
          }
        };
      }
      return { status: 'failed' as const, error: data.error || 'Unknown status' };
    } catch {
      return { status: 'failed' as const, error: 'Failed to connect to Wav2Lip server' };
    }
  }

  async cancelJob(jobId: string): Promise<void> {
    this.localJobs.delete(jobId);
    try {
      await fetch(`${this.apiUrl}/jobs/${jobId}/cancel`, { method: 'POST' });
    } catch {
      // Ignora erro de cancelamento
    }
  }

  estimateCost(_request: LipSyncRequest): number {
    return 0; // Wav2Lip local/self-hosted é gratuito
  }
}
