'use client';

import { useRef, useCallback } from 'react';
import { TimelineTrack } from '@/types';
import { useTimelineStore } from '@/modules/timeline/store';
import { TrackItemComponent } from './track-item';

interface TrackProps {
  track: TimelineTrack;
  index: number;
}

const trackIcons: Record<string, string> = {
  video: '🎬',
  audio: '🎵',
  narration: '🎙️',
  music: '🎶',
  captions: '💬',
};

export function Track({ track, index }: TrackProps) {
  const zoom = useTimelineStore(s => s.zoom);
  const duration = useTimelineStore(s => s.duration);
  const addItem = useTimelineStore(s => s.addItem);
  const toggleTrackVisibility = useTimelineStore(s => s.toggleTrackVisibility);
  const toggleTrackLock = useTimelineStore(s => s.toggleTrackLock);

  const totalWidth = (duration / 1000) * zoom;

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left + (e.currentTarget.scrollLeft || 0);
    const startTime = (x / zoom) * 1000;

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      addItem(track.id, {
        startTime: Math.max(0, startTime),
        duration: data.duration || 3000,
        sourceUrl: data.url || '',
        type: data.type || track.type === 'video' ? 'video_clip' : 'audio_clip',
        thumbnailUrl: data.thumbnailUrl,
        volume: 1,
      });
    } catch {}
  }, [track.id, track.type, zoom, addItem]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="flex h-16 group">
      <div className="w-40 shrink-0 bg-zinc-900/50 border-r border-zinc-800 flex items-center gap-2 px-3">
        <span className="text-base">{trackIcons[track.type] || '📄'}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-zinc-300 truncate">{track.name}</p>
          <p className="text-[10px] text-zinc-500">{track.items.length} itens</p>
        </div>
        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => toggleTrackVisibility(track.id)}
            className={`w-5 h-5 rounded text-[10px] ${track.visible ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-700'}`}
            title={track.visible ? 'Ocultar' : 'Mostrar'}
          >
            {track.visible ? '👁' : '🙈'}
          </button>
          <button
            onClick={() => toggleTrackLock(track.id)}
            className={`w-5 h-5 rounded text-[10px] ${track.locked ? 'text-red-400' : 'text-zinc-400 hover:text-zinc-200'}`}
            title={track.locked ? 'Destravar' : 'Travar'}
          >
            {track.locked ? '🔒' : '🔓'}
          </button>
        </div>
      </div>

      <div
        className={`flex-1 relative bg-zinc-900/30 ${index % 2 === 0 ? 'bg-zinc-900/10' : ''}`}
        style={{ minWidth: totalWidth }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {track.items.map(item => (
          <TrackItemComponent key={item.id} item={item} zoom={zoom} />
        ))}

        {track.items.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] text-zinc-700 pointer-events-none">
              Arraste mídia aqui
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
