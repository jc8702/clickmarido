import { ILipSyncProvider, LipSyncProviderName } from '../types';
import { LipSyncRequest } from '@/types';

export class Wav2LipProvider implements ILipSyncProvider {
  name: LipSyncProviderName = 'wav2lip';

  private apiUrl: string;
  private apiKey: string;

  constructor(config?: { apiUrl?: string; apiKey?: string }) {
    this.apiUrl = config?.apiUrl || process.env.WAV2LIP_API_URL || 'http://localhost:8000';
    this.apiKey = config?.apiKey || process.env.WAV2LIP_API_KEY || '';
  }

  async sync(request: LipSyncRequest): Promise<{ jobId: string }> {
    const formData = new FormData();

    const videoResponse = await fetch(request.videoUrl);
    const videoBlob = await videoResponse.blob();
    formData.append('video', videoBlob, 'input.mp4');

    const audioResponse = await fetch(request.audioUrl);
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

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new Error(`Wav2Lip API error (${response.status}): ${response.statusText} ${errorBody}`);
    }

    const data = await response.json();
    return { jobId: data.job_id || data.id || `wav2lip-${Date.now()}` };
  }

  async getStatus(jobId: string) {
    try {
      const response = await fetch(`${this.apiUrl}/jobs/${jobId}/status`, {
        headers: this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {},
      });

      if (!response.ok) {
        return { status: 'failed' as const, error: `HTTP ${response.status}` };
      }


      const data = await response.json();
      const status = data.status as string;
      if (status === 'pending') return { status: 'queued' as const };
      if (status === 'processing') return { status: 'processing' as const, progress: data.progress || 50 };
      if (status === 'completed') return { status: 'completed' as const, result: { videoUrl: data.output_url || data.result_url, duration: data.duration || 0, cost: 0, provider: this.name, metadata: data } };
      return { status: 'failed' as const, error: data.error || 'Unknown status' };
    } catch {
      return { status: 'failed' as const, error: 'Failed to connect to Wav2Lip server' };
    }
  }

  async cancelJob(jobId: string): Promise<void> {
    try {
      await fetch(`${this.apiUrl}/jobs/${jobId}/cancel`, { method: 'POST' });
    } catch {
      // Wav2Lip local pode não suportar cancelamento
    }
  }

  estimateCost(_request: LipSyncRequest): number {
    return 0; // Wav2Lip self-hosted é gratuito
  }
}
