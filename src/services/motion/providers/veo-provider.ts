import { IVideoProvider, VideoGenerationRequest, ProviderConfig } from './types';
import { JobStatusResponse, VideoGenerationResult } from '@/types';

export class VeoProvider implements IVideoProvider {
  name = 'veo';

  private apiKey: string;
  private baseUrl: string;

  constructor(config?: ProviderConfig) {
    this.apiKey = config?.apiKey || process.env.GEMINI_API_KEY || process.env.VEO_API_KEY || '';
    this.baseUrl = config?.baseUrl || 'https://generativelanguage.googleapis.com/v1beta';
  }

  async generateVideo(request: VideoGenerationRequest): Promise<{ jobId: string }> {
    const prompt = this.buildPrompt(request);

    const response = await fetch(
      `${this.baseUrl}/models/veo-2.0:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { file_data: { file_uri: request.imageUrl, mime_type: 'image/jpeg' } }
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

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new Error(`Veo API error (${response.status}): ${response.statusText} ${errorBody}`);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];

    return {
      jobId: candidate?.index?.toString() || `veo-${Date.now()}`,
    };
  }

  async getStatus(_jobId: string): Promise<JobStatusResponse> { // eslint-disable-line @typescript-eslint/no-unused-vars
    return { status: 'completed', result: {} as VideoGenerationResult };
  }

  async cancelJob(_jobId: string): Promise<void> { // eslint-disable-line @typescript-eslint/no-unused-vars
    // Veo doesn't support cancellation via API
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
