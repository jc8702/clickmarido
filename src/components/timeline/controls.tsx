'use client';

import { useTimelineStore } from '@/modules/timeline/store';

export function TimelineControls() {
  const isPlaying = useTimelineStore(s => s.isPlaying);
  const currentTime = useTimelineStore(s => s.currentTime);
  const duration = useTimelineStore(s => s.duration);
  const zoom = useTimelineStore(s => s.zoom);
  const togglePlay = useTimelineStore(s => s.togglePlay);
  const stop = useTimelineStore(s => s.stop);
  const setZoom = useTimelineStore(s => s.setZoom);
  const setCurrentTime = useTimelineStore(s => s.setCurrentTime);

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    const msRemaining = ms % 1000;
    return `${m}:${s.toString().padStart(2, '0')}.${msRemaining.toString().padStart(3, '0')}`;
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900 border-t border-zinc-800">
      <button
        onClick={stop}
        className="w-8 h-8 flex items-center justify-center rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
        title="Parar"
      >
        ⏹
      </button>

      <button
        onClick={togglePlay}
        className="w-8 h-8 flex items-center justify-center rounded hover:bg-zinc-800 text-zinc-200 transition-colors"
        title={isPlaying ? 'Pausar' : 'Play'}
      >
        {isPlaying ? '⏸' : '▶️'}
      </button>

      <span className="text-xs font-mono text-zinc-400 min-w-[120px] tabular-nums">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>

      <div className="flex-1" />

      <span className="text-[10px] text-zinc-600">Zoom</span>
      <input
        type="range"
        min={2}
        max={100}
        value={zoom}
        onChange={e => setZoom(Number(e.target.value))}
        className="w-24 h-1 appearance-none bg-zinc-700 rounded-full cursor-pointer accent-blue-500"
      />
      <span className="text-[10px] text-zinc-500 w-6 text-right">{zoom}px</span>
    </div>
  );
}
