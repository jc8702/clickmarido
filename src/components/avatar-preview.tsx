'use client';

import { useState, useRef, useEffect } from 'react';
import { LipSyncResult } from '@/types';

interface AvatarPreviewProps {
  videoUrl?: string;
  audioUrl?: string;
  onLipSyncComplete?: (result: LipSyncResult) => void;
  className?: string;
}

export function AvatarPreview({
  videoUrl,
  audioUrl,
  onLipSyncComplete,
  className = '',
}: AvatarPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startLipSync = async () => {
    if (!videoUrl || !audioUrl) return;

    setIsSyncing(true);
    setError(null);
    setProgress(0);

    try {
      const response = await fetch('/api/lipsync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl, audioUrl }),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error);

      const id = data.data.jobId;
      setJobId(id);

      await pollStatus(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao iniciar lip sync');
      setIsSyncing(false);
    }
  };

  const pollStatus = async (id: string) => {
    const maxAttempts = 60;
    let attempts = 0;

    const poll = async () => {
      if (attempts >= maxAttempts) {
        setError('Tempo limite excedido');
        setIsSyncing(false);
        return;
      }

      attempts++;

      try {
        const response = await fetch(`/api/lipsync/status/${id}`);
        const data = await response.json();

        if (!data.success) throw new Error(data.error);

        const status = data.data;

        switch (status.status) {
          case 'processing':
            setProgress(status.progress || 0);
            setTimeout(poll, 1000);
            break;
          case 'completed':
            setProgress(100);
            setResultUrl(status.result.videoUrl);
            setIsSyncing(false);
            onLipSyncComplete?.(status.result);
            break;
          case 'failed':
            setError(status.error || 'Falha no processamento');
            setIsSyncing(false);
            break;
          default:
            setTimeout(poll, 1000);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao verificar status');
        setIsSyncing(false);
      }
    };

    setTimeout(poll, 1000);
  };

  useEffect(() => {
    return () => setJobId(null);
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="relative aspect-video bg-zinc-900 rounded-xl overflow-hidden">
        {resultUrl ? (
          <video
            ref={videoRef}
            src={resultUrl}
            controls
            className="w-full h-full object-contain"
            autoPlay
            loop
          />
        ) : videoUrl ? (
          <video
            src={videoUrl}
            className="w-full h-full object-contain"
            muted
            loop
            autoPlay
          />
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-600">
            <div className="text-center">
              <div className="text-4xl mb-2">🎭</div>
              <p className="text-sm">Nenhum vídeo selecionado</p>
            </div>
          </div>
        )}

        {isSyncing && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-zinc-300">Sincronizando lábios...</p>
              {progress > 0 && (
                <div className="mt-2 w-48 bg-zinc-700 rounded-full h-1.5 mx-auto">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={startLipSync}
          disabled={isSyncing || !videoUrl || !audioUrl}
          className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          {isSyncing ? 'Sincronizando...' : resultUrl ? 'Refazer Lip Sync' : 'Iniciar Lip Sync'}
        </button>

        {resultUrl && (
          <a
            href={resultUrl}
            download="lipsync-output.mp4"
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            Download
          </a>
        )}
      </div>
    </div>
  );
}
