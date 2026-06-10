'use client';

import { useRef, useCallback, useEffect } from 'react';
import { useTimelineStore } from '@/modules/timeline/store';

export function Ruler() {
  const containerRef = useRef<HTMLDivElement>(null);
  const duration = useTimelineStore(s => s.duration);
  const zoom = useTimelineStore(s => s.zoom);
  const setCurrentTime = useTimelineStore(s => s.setCurrentTime);

  const totalWidth = (duration / 1000) * zoom;

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + containerRef.current.scrollLeft;
    const timeMs = (x / zoom) * 1000;
    setCurrentTime(Math.max(0, Math.min(timeMs, duration)));
  }, [zoom, duration, setCurrentTime]);

  const formatTime = (ms: number): string => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const tickInterval = zoom <= 5 ? 5000 : zoom <= 15 ? 2000 : zoom <= 30 ? 1000 : 500;

  const ticks: { time: number; label: string; major: boolean }[] = [];
  for (let t = 0; t <= duration; t += tickInterval) {
    ticks.push({ time: t, label: formatTime(t), major: t % 10000 === 0 });
  }

  return (
    <div
      ref={containerRef}
      className="relative h-8 bg-zinc-900 border-b border-zinc-800 overflow-hidden select-none"
      onClick={handleClick}
      style={{ minWidth: totalWidth }}
    >
      <div className="relative h-full" style={{ width: totalWidth }}>
        {ticks.map((tick, i) => (
          <div
            key={i}
            className={`absolute top-0 ${tick.major ? 'h-full' : 'h-1/2'}`}
            style={{ left: (tick.time / 1000) * zoom }}
          >
            <div className="w-px bg-zinc-700 h-full" />
            {tick.major && (
              <span className="absolute top-1 left-2 text-[10px] text-zinc-500 pointer-events-none">
                {tick.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
