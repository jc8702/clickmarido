'use client';

import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { CalendarDays, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CalendarView } from '@/components/appointments/calendar-view';

export default function AgendaPage() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4 bg-card">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <CalendarDays className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">Agenda</h2>
        </div>
        <div className="flex items-center gap-2">
          {session ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success"></span>
                Sincronizado
              </span>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                Desconectar
              </Button>
            </div>
          ) : (
            <Button variant="default" size="sm" onClick={() => signIn('google')} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <Link className="w-4 h-4" />
              Conectar Google Agenda
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Esquerda (Mini Calendário e Filtros) */}
        <aside className="w-64 border-r bg-muted/20 p-4 hidden md:flex flex-col gap-6">
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">Filtros</h3>
            <p className="text-xs text-muted-foreground">Em breve: seleção de técnicos e status</p>
          </div>
        </aside>

        {/* Grade do Calendário */}
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-background">
          <CalendarView />
        </main>
      </div>
    </div>
  );
}
