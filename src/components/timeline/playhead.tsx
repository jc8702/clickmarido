'use client';

import { useRef, useCallback, useEffect } from 'react';
import { useTimelineStore } from '@/modules/timeline/store';

export function Playhead() {
  const currentTime = useTimelineStore(s => s.currentTime);
  const duration = useTimelineStore(s => s.duration);
  const isPlaying = useTimelineStore(s => s.isPlaying);
  const zoom = useTimelineStore(s => s.zoom);
  const setCurrentTime = useTimelineStore(s => s.setCurrentTime);
  const pause = useTimelineStore(s => s.pause);

  const playheadRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const x = (currentTime / 1000) * zoom;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    if (isPlaying) pause();
  }, [isPlaying, pause]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !playheadRef.current?.parentElement) return;
    const rect = playheadRef.current.parentElement.getBoundingClientRect();
    const scrollLeft = playheadRef.current.parentElement.scrollLeft || 0;
    const xPos = e.clientX - rect.left + scrollLeft;
    const timeMs = (xPos / zoom) * 1000;
    setCurrentTime(Math.max(0, Math.min(timeMs, duration)));
  }, [zoom, duration, setCurrentTime]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={playheadRef}
      className="absolute top-0 bottom-0 w-px z-20 pointer-events-none"
      style={{ left: x }}
    >
      <div
        className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full pointer-events-auto cursor-grab active:cursor-grabbing shadow-lg shadow-blue-500/30 z-30"
        onMouseDown={handleMouseDown}
      />
      <div className="w-px h-full bg-blue-500/80 shadow-sm shadow-blue-500/20" />
    </div>
  );
}
