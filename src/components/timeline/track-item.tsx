'use client';

import { useRef, useCallback, useState } from 'react';
import { TimelineItem } from '@/types';
import { useTimelineStore } from '@/modules/timeline/store';
import { cn } from '@/lib/utils';

interface TrackItemProps {
  item: TimelineItem;
  zoom: number;
}

const typeStyles: Record<string, string> = {
  video_clip: 'bg-blue-600/30 border-blue-500/50 hover:bg-blue-600/40',
  audio_clip: 'bg-green-600/30 border-green-500/50 hover:bg-green-600/40',
  narration_clip: 'bg-purple-600/30 border-purple-500/50 hover:bg-purple-600/40',
  music_clip: 'bg-orange-600/30 border-orange-500/50 hover:bg-orange-600/40',
  caption_overlay: 'bg-yellow-600/30 border-yellow-500/50 hover:bg-yellow-600/40',
};

const typeIcons: Record<string, string> = {
  video_clip: '🎬',
  audio_clip: '🎵',
  narration_clip: '🎙️',
  music_clip: '🎶',
  caption_overlay: '💬',
};

export function TrackItemComponent({ item, zoom }: TrackItemProps) {
  const removeItem = useTimelineStore(s => s.removeItem);
  const resizeItem = useTimelineStore(s => s.resizeItem);
  const moveItem = useTimelineStore(s => s.moveItem);
  const updateItem = useTimelineStore(s => s.updateItem);

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStart = useRef({ x: 0, startTime: 0 });
  const resizeStart = useRef({ x: 0, startWidth: 0 });

  const left = (item.startTime / 1000) * zoom;
  const width = (item.duration / 1000) * zoom;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, startTime: item.startTime };
    e.preventDefault();

    const handleMove = (ev: MouseEvent) => {
      const dx = ev.clientX - dragStart.current.x;
      const dt = Math.round((dx / zoom) * 1000 / 100) * 100;
      moveItem(item.id, Math.max(0, dragStart.current.startTime + dt));
    };

    const handleUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  }, [item.id, item.startTime, zoom, moveItem]);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    resizeStart.current = { x: e.clientX, startWidth: item.duration };
    e.preventDefault();

    const handleMove = (ev: MouseEvent) => {
      const dx = ev.clientX - resizeStart.current.x;
      const newDuration = Math.max(500, resizeStart.current.startWidth + (dx / zoom) * 1000);
      resizeItem(item.id, Math.round(newDuration / 100) * 100);
    };

    const handleUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  }, [item.id, item.duration, zoom, resizeItem]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    removeItem(item.id);
  }, [item.id, removeItem]);

  if (width < 4) return null;

  return (
    <div
      className={cn(
        'absolute top-1 bottom-1 rounded-md border cursor-grab active:cursor-grabbing group overflow-hidden',
        typeStyles[item.type] || 'bg-zinc-600/30 border-zinc-500/50',
        isDragging && 'opacity-80 shadow-lg z-10',
      )}
      style={{ left, width, minWidth: 20 }}
      onMouseDown={handleMouseDown}
    >
      <div className="flex items-center gap-1.5 h-full px-2 text-xs truncate">
        <span className="text-[10px]">{typeIcons[item.type] || '📄'}</span>
        <span className="text-zinc-300 truncate">
          {item.type.replace('_', ' ')}
        </span>
      </div>

      <div
        className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize opacity-0 group-hover:opacity-100 bg-zinc-400/20 hover:bg-zinc-400/40 rounded-r-md transition-opacity"
        onMouseDown={handleResizeStart}
      />

      <button
        onClick={handleDelete}
        className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-lg z-20"
      >
        ×
      </button>
    </div>
  );
}
