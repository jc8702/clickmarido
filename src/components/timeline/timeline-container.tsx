'use client';

import { useEffect, useRef } from 'react';
import { useTimelineStore } from '@/modules/timeline/store';
import { Ruler } from './ruler';
import { Playhead } from './playhead';
import { Track } from './track';
import { TimelineControls } from './controls';

interface TimelineContainerProps {
  className?: string;
}

export function TimelineContainer({ className = '' }: TimelineContainerProps) {
  const tracks = useTimelineStore(s => s.tracks);
  const duration = useTimelineStore(s => s.duration);
  const zoom = useTimelineStore(s => s.zoom);
  const currentTime = useTimelineStore(s => s.currentTime);
  const isPlaying = useTimelineStore(s => s.isPlaying);
  const setCurrentTime = useTimelineStore(s => s.setCurrentTime);
  const addTrack = useTimelineStore(s => s.addTrack);

  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    lastTimeRef.current = performance.now();

    const animate = (now: number) => {
      const dt = now - lastTimeRef.current;
      lastTimeRef.current = now;

      const newTime = currentTime + dt;
      if (newTime >= duration) {
        useTimelineStore.getState().pause();
        useTimelineStore.getState().setCurrentTime(0);
        return;
      }

      useTimelineStore.getState().setCurrentTime(newTime);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, currentTime, duration]);

  const totalWidth = (duration / 1000) * zoom;

  const handleTimelineClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left + (e.currentTarget.scrollLeft || 0);
    const timeMs = (x / zoom) * 1000;
    setCurrentTime(Math.max(0, Math.min(timeMs, duration)));
  };

  return (
    <div className={`flex flex-col bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/50 border-b border-zinc-800">
        <h3 className="text-sm font-medium text-zinc-300">Timeline</h3>
        <button
          onClick={() => addTrack('video', `Faixa ${tracks.length + 1}`)}
          className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded transition-colors"
        >
          + Faixa
        </button>
      </div>

      <div className="flex flex-col overflow-hidden">
        <div className="flex">
          <div className="w-40 shrink-0" />
          <div className="flex-1 overflow-x-auto overflow-y-hidden">
            <Ruler />
          </div>
        </div>

        <div className="flex flex-1 overflow-y-auto overflow-x-hidden">
          <div className="flex flex-col flex-1">
            <div className="flex" style={{ minWidth: totalWidth + 160 }}>
              <div className="w-40 shrink-0" />
              <div
                className="flex-1 relative cursor-pointer"
                onClick={handleTimelineClick}
                style={{ minHeight: tracks.length * 64 }}
              >
                <Playhead />

                <div className="relative">
                  {tracks.map((track, i) => (
                    <Track key={track.id} track={track} index={i} />
                  ))}
                </div>

                {tracks.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-zinc-600 text-sm">
                    Nenhuma faixa. Adicione mídia para começar.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <TimelineControls />
    </div>
  );
}
