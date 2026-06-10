import { IVideoProvider, VideoGenerationRequest, ProviderName } from './providers/types';
import { VeoProvider } from './providers/veo-provider';
import { MockProvider } from './mock-provider';
import { ImageAnalysis, MotionConfig, JobStatusResponse } from '@/types';

export class MotionEngine {
  private providers: Map<ProviderName, IVideoProvider> = new Map();
  private activeProvider: ProviderName;

  constructor(activeProvider: ProviderName = 'mock') {
    this.activeProvider = activeProvider;
    this.registerProvider('veo', new VeoProvider());
    this.registerProvider('mock', new MockProvider());
  }

  registerProvider(name: ProviderName, provider: IVideoProvider): void {
    this.providers.set(name, provider);
  }

  setActiveProvider(name: ProviderName): void {
    if (!this.providers.has(name)) {
      throw new Error(`Provider "${name}" não registrado`);
    }
    this.activeProvider = name;
  }

  getProvider(name?: ProviderName): IVideoProvider {
    const providerName = name || this.activeProvider;
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(
        `Provider "${providerName}" não encontrado. Disponíveis: ${Array.from(this.providers.keys()).join(', ')}`
      );
    }
    return provider;
  }

  async generateVideo(
    imageUrl: string,
    imageAnalysis: ImageAnalysis,
    motionConfig?: Partial<MotionConfig>,
    options?: {
      duration?: number;
      audioUrl?: string;
      lipsyncEnabled?: boolean;
      provider?: ProviderName;
    }
  ): Promise<{ jobId: string }> {
    const provider = this.getProvider(options?.provider);

    const defaultMotion: MotionConfig = {
      camera: imageAnalysis.suggestedMotion,
      backgroundParallax: false,
      elementMovement: false,
      lightVariation: false,
      ...motionConfig,
    };

    const request: VideoGenerationRequest = {
      imageUrl,
      imageAnalysis,
      motionConfig: defaultMotion,
      duration: options?.duration || 5,
      audioUrl: options?.audioUrl,
      lipsyncEnabled: options?.lipsyncEnabled ?? imageAnalysis.faceData.detected,
    };

    return provider.generateVideo(request);
  }

  async getStatus(jobId: string, providerName?: ProviderName): Promise<JobStatusResponse> {
    return this.getProvider(providerName).getStatus(jobId);
  }

  async cancelJob(jobId: string, providerName?: ProviderName): Promise<void> {
    return this.getProvider(providerName).cancelJob(jobId);
  }

  estimateCost(
    config: { duration: number; resolution: string },
    providerName?: ProviderName
  ): number {
    return this.getProvider(providerName).estimateCost(config);
  }

  listProviders(): { name: ProviderName; available: boolean }[] {
    return Array.from(this.providers.entries()).map(([name]) => ({
      name,
      available: true,
    }));
  }
}

export const motionEngine = new MotionEngine(
  (process.env.NEXT_PUBLIC_MOTION_PROVIDER as ProviderName) || 'mock'
);
