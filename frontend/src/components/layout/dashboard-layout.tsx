"use client";

import React, { createContext, useContext, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

interface LayoutContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout deve ser usado dentro de um LayoutProvider");
  }
  return context;
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Controle para mobile (abrir/fechar gaveta)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Controle para desktop (recolher/colapsar sidebar)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // A renderização condicional por rota foi removida.
  // Agora o App Router usa (dashboard)/layout.tsx para este componente
  // e (auth)/layout.tsx para rotas limpas.

  return (
    <LayoutContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        sidebarCollapsed,
        setSidebarCollapsed,
      }}
    >
      <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground transition-colors duration-200">
        {/* Sidebar Lateral */}
        <Sidebar />

        {/* Lado Direito: Topbar + Conteúdo */}
        <div className="flex flex-1 flex-col overflow-hidden relative">
          {/* Topbar Superior */}
          <Topbar />

          {/* Área do Conteúdo Principal */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-zinc-50 dark:bg-zinc-900/40 transition-colors duration-200">
            {children}
          </main>
        </div>
      </div>
    </LayoutContext.Provider>
  );
}
