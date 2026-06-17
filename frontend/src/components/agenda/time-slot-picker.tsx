'use client';

interface TimeSlotPickerProps {
  startTime: string;
  setStartTime: (time: string) => void;
  endTime: string;
  setEndTime: (time: string) => void;
  error?: string;
}

export function TimeSlotPicker({
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  error,
}: TimeSlotPickerProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <label
          htmlFor="start-time"
          className="text-xs font-bold text-zinc-400 uppercase tracking-wider"
        >
          Início
        </label>
        <input
          id="start-time"
          type="datetime-local"
          required
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className={`w-full h-10 px-3 rounded-lg bg-zinc-900 border ${error ? 'border-red-500/50 focus:ring-red-500/20' : 'border-zinc-800 focus:ring-amber-500/20 focus:border-amber-500/50'} text-sm text-white focus:outline-none focus:ring-2`}
        />
      </div>
      <div className="space-y-1">
        <label
          htmlFor="end-time"
          className="text-xs font-bold text-zinc-400 uppercase tracking-wider"
        >
          Término
        </label>
        <input
          id="end-time"
          type="datetime-local"
          required
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className={`w-full h-10 px-3 rounded-lg bg-zinc-900 border ${error ? 'border-red-500/50 focus:ring-red-500/20' : 'border-zinc-800 focus:ring-amber-500/20 focus:border-amber-500/50'} text-sm text-white focus:outline-none focus:ring-2`}
        />
      </div>
    </div>
  );
}
