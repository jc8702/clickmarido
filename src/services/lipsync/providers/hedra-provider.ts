import { ILipSyncProvider, LipSyncProviderName } from '../types';
import { LipSyncRequest } from '@/types';

export class HedraProvider implements ILipSyncProvider {
  name: LipSyncProviderName = 'hedra';

  private apiKey: string;
  private baseUrl = 'https://api.hedra.com/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.HEDRA_API_KEY || '';
  }

  async sync(request: LipSyncRequest): Promise<{ jobId: string }> {
    if (!this.apiKey) {
      throw new Error('Hedra API key não configurada');
    }

    const formData = new FormData();

    const videoResponse = await fetch(request.videoUrl);
    const videoBlob = await videoResponse.blob();
    formData.append('video', videoBlob, 'input.mp4');

    const audioResponse = await fetch(request.audioUrl);
    const audioBlob = await audioResponse.blob();
    formData.append('audio', audioBlob, 'audio.mp3');

    if (request.faceBoundingBox) {
      formData.append('face_bbox', JSON.stringify(request.faceBoundingBox));
    }

    formData.append('sync_mode', 'accurate');
    formData.append('output_format', 'mp4');

    const response = await fetch(`${this.baseUrl}/lipsync`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new Error(`Hedra API error (${response.status}): ${response.statusText} ${errorBody}`);
    }

    const data = await response.json();
    return { jobId: data.job_id || data.id };
  }

  async getStatus(jobId: string) {
    const response = await fetch(`${this.baseUrl}/jobs/${jobId}`, {
      headers: { Authorization: `Bearer ${this.apiKey}` },
    });

    if (!response.ok) {
      throw new Error(`Hedra status error (${response.status})`);
    }

    const data = await response.json();

    const status = data.status as string;
    if (status === 'pending') return { status: 'queued' as const };
    if (status === 'processing') return { status: 'processing' as const, progress: data.progress || 50 };
    if (status === 'completed') return { status: 'completed' as const, result: { videoUrl: data.output?.video_url || data.result_url, duration: data.duration || 0, cost: data.cost || 0, provider: this.name, metadata: data } };
    return { status: 'failed' as const, error: data.error || 'Unknown status' };
  }

  async cancelJob(jobId: string): Promise<void> {
    await fetch(`${this.baseUrl}/jobs/${jobId}/cancel`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.apiKey}` },
    });
  }

  estimateCost(request: LipSyncRequest): number {
    const durationMinutes = (request.phonemes?.length || 100) / 100;
    return Math.ceil(durationMinutes) * 2; // ~$2/minuto
  }
}
