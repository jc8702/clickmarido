'use client';

import { create } from 'zustand';
import { TimelineState, TimelineTrack, TimelineItem } from '@/types';

interface TimelineActions {
  addTrack: (type: TimelineTrack['type'], name?: string) => void;
  removeTrack: (trackId: string) => void;
  toggleTrackVisibility: (trackId: string) => void;
  toggleTrackLock: (trackId: string) => void;

  addItem: (trackId: string, item: Omit<TimelineItem, 'id' | 'trackId'>) => void;
  removeItem: (itemId: string) => void;
  moveItem: (itemId: string, newStartTime: number, newTrackId?: string) => void;
  resizeItem: (itemId: string, newDuration: number) => void;
  updateItem: (itemId: string, changes: Partial<TimelineItem>) => void;

  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setZoom: (zoom: number) => void;

  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  stop: () => void;

  clear: () => void;

  loadFromProject: (tracks: TimelineTrack[], duration: number) => void;
  exportState: () => { tracks: TimelineTrack[]; duration: number };
}

type TimelineStore = TimelineState & TimelineActions;

const defaultTrack = (type: TimelineTrack['type'], index: number): TimelineTrack => ({
  id: `track-${type}-${Date.now()}-${index}`,
  type,
  name: type === 'video' ? 'Vídeo'
    : type === 'narration' ? 'Narração'
    : type === 'music' ? 'Música'
    : type === 'captions' ? 'Legendas'
    : 'Áudio',
  items: [],
  visible: true,
  locked: false,
});

const initialState: TimelineState = {
  tracks: [
    defaultTrack('video', 0),
    defaultTrack('narration', 0),
    defaultTrack('music', 0),
    defaultTrack('captions', 0),
  ],
  duration: 30000,
  fps: 30,
  currentTime: 0,
  isPlaying: false,
  zoom: 10,
};

export const useTimelineStore = create<TimelineStore>((set, get) => ({
  ...initialState,

  addTrack: (type, name) => set(state => {
    const index = state.tracks.filter(t => t.type === type).length;
    return { tracks: [...state.tracks, { ...defaultTrack(type, index), name: name || defaultTrack(type, index).name }] };
  }),

  removeTrack: (trackId) => set(state => ({
    tracks: state.tracks.filter(t => t.id !== trackId),
  })),

  toggleTrackVisibility: (trackId) => set(state => ({
    tracks: state.tracks.map(t =>
      t.id === trackId ? { ...t, visible: !t.visible } : t
    ),
  })),

  toggleTrackLock: (trackId) => set(state => ({
    tracks: state.tracks.map(t =>
      t.id === trackId ? { ...t, locked: !t.locked } : t
    ),
  })),

  addItem: (trackId, item) => set(state => ({
    tracks: state.tracks.map(t =>
      t.id === trackId
        ? {
            ...t,
            items: [...t.items, {
              ...item,
              id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              trackId,
            }],
          }
        : t
    ),
  })),

  removeItem: (itemId) => set(state => ({
    tracks: state.tracks.map(t => ({
      ...t,
      items: t.items.filter(i => i.id !== itemId),
    })),
  })),

  moveItem: (itemId, newStartTime, newTrackId) => set(state => {
    let movedItem: TimelineItem | undefined;
    const tracksWithoutItem = state.tracks.map(t => {
      const item = t.items.find(i => i.id === itemId);
      if (item) movedItem = item;
      return { ...t, items: t.items.filter(i => i.id !== itemId) };
    });

    if (!movedItem) return state;

    if (newTrackId) {
      return {
        tracks: tracksWithoutItem.map(t =>
          t.id === newTrackId
            ? { ...t, items: [...t.items, { ...movedItem!, id: itemId, startTime: newStartTime, trackId: newTrackId }] }
            : t
        ),
      };
    }

    return {
      tracks: tracksWithoutItem.map(t =>
        t.id === movedItem!.trackId
          ? { ...t, items: [...t.items, { ...movedItem!, startTime: newStartTime }] }
          : t
      ),
    };
  }),

  resizeItem: (itemId, newDuration) => set(state => ({
    tracks: state.tracks.map(t => ({
      ...t,
      items: t.items.map(i =>
        i.id === itemId ? { ...i, duration: Math.max(500, newDuration) } : i
      ),
    })),
  })),

  updateItem: (itemId, changes) => set(state => ({
    tracks: state.tracks.map(t => ({
      ...t,
      items: t.items.map(i =>
        i.id === itemId ? { ...i, ...changes } : i
      ),
    })),
  })),

  setCurrentTime: (time) => set({ currentTime: Math.max(0, Math.min(time, get().duration)) }),
  setDuration: (duration) => set({ duration }),
  setZoom: (zoom) => set({ zoom: Math.max(2, Math.min(100, zoom)) }),

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlay: () => set(state => ({ isPlaying: !state.isPlaying })),
  stop: () => set({ isPlaying: false, currentTime: 0 }),

  clear: () => set(initialState),

  loadFromProject: (tracks, duration) => set({ tracks, duration, currentTime: 0, isPlaying: false }),

  exportState: () => {
    const { tracks, duration } = get();
    return { tracks, duration };
  },
}));
