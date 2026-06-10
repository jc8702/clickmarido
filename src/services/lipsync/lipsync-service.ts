import { ILipSyncProvider, LipSyncProviderName } from './types';
import { HedraProvider } from './providers/hedra-provider';
import { Wav2LipProvider } from './providers/wav2lip-provider';
import { MockLipSyncProvider } from './providers/mock-lipsync-provider';
import { LipSyncRequest, LipSyncResult } from '@/types';

export class LipSyncService {
  private providers: Map<LipSyncProviderName, ILipSyncProvider> = new Map();
  private activeProvider: LipSyncProviderName;

  constructor(activeProvider: LipSyncProviderName = 'mock') {
    this.activeProvider = activeProvider;
    this.registerProvider('hedra', new HedraProvider());
    this.registerProvider('wav2lip', new Wav2LipProvider());
    this.registerProvider('mock', new MockLipSyncProvider());
  }

  registerProvider(name: LipSyncProviderName, provider: ILipSyncProvider): void {
    this.providers.set(name, provider);
  }

  setActiveProvider(name: LipSyncProviderName): void {
    if (!this.providers.has(name)) {
      throw new Error(`Provider LipSync "${name}" não registrado`);
    }
    this.activeProvider = name;
  }

  getProvider(name?: LipSyncProviderName): ILipSyncProvider {
    const providerName = name || this.activeProvider;
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(
        `Provider LipSync "${providerName}" não encontrado. Disponíveis: ${Array.from(this.providers.keys()).join(', ')}`
      );
    }
    return provider;
  }

  async sync(request: LipSyncRequest, providerName?: LipSyncProviderName): Promise<{ jobId: string }> {
    const provider = this.selectBestProvider(request, providerName);
    return provider.sync(request);
  }

  async getStatus(jobId: string, providerName?: LipSyncProviderName) {
    return this.getProvider(providerName).getStatus(jobId);
  }

  async cancelJob(jobId: string, providerName?: LipSyncProviderName): Promise<void> {
    return this.getProvider(providerName).cancelJob(jobId);
  }

  private selectBestProvider(request: LipSyncRequest, preferred?: LipSyncProviderName): ILipSyncProvider {
    if (preferred) return this.getProvider(preferred);

    // Hedra é prioridade para produção
    if (process.env.HEDRA_API_KEY && this.providers.has('hedra')) {
      return this.providers.get('hedra')!;
    }

    // Wav2Lip como fallback
    if (this.providers.has('wav2lip')) {
      return this.providers.get('wav2lip')!;
    }

    // Mock como último recurso
    return this.getProvider('mock');
  }

  estimateCost(request: LipSyncRequest, providerName?: LipSyncProviderName): number {
    return this.getProvider(providerName).estimateCost(request);
  }

  listProviders(): LipSyncProviderName[] {
    return Array.from(this.providers.keys()) as LipSyncProviderName[];
  }
}

export const lipSyncService = new LipSyncService(
  (process.env.NEXT_PUBLIC_LIPSYNC_PROVIDER as LipSyncProviderName) || 'mock'
);
