'use client';

import React from 'react';
import { format, isSameDay, isAfter, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarTimelineProps {
  events: Record<string, unknown>[];
  loading: boolean;
}

export function SidebarTimeline({ events, loading }: SidebarTimelineProps) {
  const today = startOfDay(new Date());

  // Filtrar e ordenar eventos de hoje em diante
  const upcomingEvents = events
    .filter((s) => isSameDay((s as Record<string, unknown>).start as Date, today) || isAfter((s as Record<string, unknown>).start as Date, today))
    .sort((a, b) => ((a as Record<string, unknown>).start as Date).getTime() - ((b as Record<string, unknown>).start as Date).getTime());

  // Agrupar por data
  const groupedEvents = upcomingEvents.reduce(
    (acc: Record<string, unknown[]>, s) => {
      const event = s as Record<string, unknown>;
      const dateStr = format(event.start as Date, 'yyyy-MM-dd');
      if (!acc[dateStr]) acc[dateStr] = [];
      acc[dateStr].push(event);
      return acc;
    },
    {} as Record<string, unknown[]>,
  );

  const dates = Object.keys(groupedEvents).sort();

  return (
    <aside className="w-80 border-r bg-card hidden md:flex flex-col shadow-sm z-10">
      <div className="p-5 border-b">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-primary" />
          Próximos Compromissos
        </h3>
        <p className="text-sm text-muted-foreground mt-1">Sua agenda a partir de hoje</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-5">
          {loading ? (
            <div className="flex flex-col gap-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-4 bg-muted rounded"></div>
                  <div className="flex-1 h-16 bg-muted/50 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : dates.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center px-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <CalendarIcon className="w-6 h-6 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-medium">Nenhum compromisso</p>
              <p className="text-xs text-muted-foreground mt-1">
                Sua agenda está livre por enquanto.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {dates.map((dateStr) => {
                const dateEvents = groupedEvents[dateStr];
                const parsedDate = new Date(dateStr + 'T00:00:00');
                const isToday = isSameDay(parsedDate, today);

                return (
                  <div key={dateStr} className="relative">
                    <h4
                      className={`text-xs font-semibold uppercase tracking-wider mb-3 sticky top-0 bg-card py-1 z-10 ${isToday ? 'text-primary' : 'text-muted-foreground'}`}
                    >
                      {isToday ? 'Hoje' : format(parsedDate, "EEEE, d 'de' MMM", { locale: ptBR })}
                    </h4>
                    <div className="space-y-3">
                      {dateEvents.map((s, idx: number) => {
                        const event = s as Record<string, unknown>;
                        return (
                        <div key={event.id as string} className="relative flex gap-3 group">
                          {/* Linha conectora da timeline */}
                          {idx !== dateEvents.length - 1 && (
                            <div className="absolute left-[1.15rem] top-6 bottom-[-1rem] w-px bg-border group-hover:bg-primary/30 transition-colors"></div>
                          )}

                          {/* Horário */}
                          <div className="w-12 pt-1 text-right">
                            <span className="text-xs font-medium text-foreground">
                              {format(event.start as Date, 'HH:mm')}
                            </span>
                          </div>

                          {/* Dot */}
                          <div className="relative mt-1.5 flex-none">
                            <div className="w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-card"></div>
                          </div>

                          {/* Card do Evento */}
                          <div className="flex-1 bg-muted/30 hover:bg-muted/50 border border-transparent hover:border-border transition-all rounded-lg p-3 cursor-pointer">
                            <h5 className="font-medium text-sm leading-tight mb-1">
                              {event.title as string}
                            </h5>
                            <div className="flex items-center text-xs text-muted-foreground gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              <span>
                                {format(event.start as Date, 'HH:mm')} - {format(event.end as Date, 'HH:mm')}
                              </span>
                            </div>
                          </div>
                        </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
