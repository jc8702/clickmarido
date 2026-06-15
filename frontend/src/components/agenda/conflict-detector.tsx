'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useAppointmentContext } from '@/contexts/appointment-context';

interface ConflictDetectorProps {
  startTime: string;
  endTime: string;
  technicianId: string;
}

export function ConflictDetector({ startTime, endTime, technicianId }: ConflictDetectorProps) {
  const { checkConflicts } = useAppointmentContext();
  const [hasConflict, setHasConflict] = useState(false);

  useEffect(() => {
    let ignore = false;
    if (startTime && endTime && technicianId) {
      checkConflicts(startTime, endTime, technicianId).then((conflict) => {
        if (!ignore) setHasConflict(conflict);
      });
    } else {
      setHasConflict(false);
    }
    return () => { ignore = true; };
  }, [startTime, endTime, technicianId, checkConflicts]);

  if (!hasConflict) return null;

  return (
    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-500 flex items-center gap-2">
      <AlertTriangle className="w-4 h-4 shrink-0" />
      Atenção: O técnico selecionado já possui um agendamento neste horário.
    </div>
  );
}
