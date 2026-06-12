"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useLayout } from "./dashboard-layout";
import { useAuth } from "@/contexts/auth-context";
import { 
  Menu, 
  Sun, 
  Moon, 
  Building2, 
  ChevronDown, 
  LogOut, 
  User as UserIcon,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";

// Tenants simulados para a demonstração multi-tenant
const tenants = [
  { id: "tenant-1", name: "Click Marido Matriz SP" },
  { id: "tenant-2", name: "Click Marido Filial RJ" },
  { id: "tenant-3", name: "Click Marido Franquia BH" },
];

export function Topbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { setSidebarOpen } = useLayout();
  const { user, company, logout } = useAuth();
  
  const [tenantDropdownOpen, setTenantDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Mapeamento de breadcrumb simplificado baseado no pathname
  const getPageTitle = () => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 0) return "Painel Geral";
    const segment = parts[0];
    switch (segment) {
      case "dashboard":
        return "Painel de Controle";
      case "clientes":
        return "Gestão de Clientes";
      case "servicos":
        return "Ordens de Serviço";
      case "orcamentos":
        return "Orçamentos e Propostas";
      case "settings":
        return "Configurações do Sistema";
      case "empresas":
        return "Gestão de Empresas";
      case "agenda":
        return "Agenda de Compromissos";
      case "usuarios":
        return "Gestão de Usuários (Time)";
      default:
        return segment.charAt(0).toUpperCase() + segment.slice(1);
    }
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-[var(--border)] px-4 md:px-6 transition-colors duration-200" style={{ background: 'color-mix(in srgb, var(--card) 80%, transparent)', backdropFilter: 'blur(12px)' }}>
      {/* Lado Esquerdo: Menu Mobile + Breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 md:hidden"
        >
          <Menu className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
        </button>

        <div className="flex flex-col">
          <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            Click Marido ERP
          </span>
          <h1 className="text-sm md:text-base font-bold text-zinc-800 dark:text-zinc-100 leading-none">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Lado Direito: Seletor de Tenant, Tema, Notificações, Perfil */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Seletor de Empresa (Multi-tenant) */}
        <div className="relative">
          <button
            onClick={() => setTenantDropdownOpen(!tenantDropdownOpen)}
            onBlur={() => setTimeout(() => setTenantDropdownOpen(false), 200)}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Building2 className="h-3.5 w-3.5 text-amber-500" />
            <span className="hidden sm:inline max-w-[130px] truncate">
              {company?.name || "Click Marido Matriz SP"}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
          </button>

          {tenantDropdownOpen && (
            <div className="absolute right-0 mt-1.5 z-50 w-56 origin-top-right rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-1 shadow-lg">
              <div className="px-2 py-1.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                Empresa Ativa
              </div>
              <button
                className="flex w-full items-center gap-2 rounded-md bg-amber-500/10 text-amber-500 px-2 py-1.5 text-left text-xs font-medium"
              >
                <Building2 className="h-3.5 w-3.5" />
                <span className="truncate">{company?.name || "Click Marido Matriz SP"}</span>
              </button>
            </div>
          )}
        </div>

        {/* Botão de Notificações (Simulado) */}
        <button className="rounded-lg p-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 flex h-1.5 w-1.5 rounded-full bg-amber-500" />
        </button>

        {/* Botão de Tema (Claro/Escuro) */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-lg p-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          title="Alternar tema"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
        </button>

        {/* Separador */}
        <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800" />

        {/* Dropdown de Perfil de Usuário */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            onBlur={() => setTimeout(() => setProfileDropdownOpen(false), 200)}
            className="flex items-center gap-2 rounded-lg p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 font-bold text-zinc-700 dark:text-zinc-300 uppercase">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2) : "CM"}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 leading-tight">
                {user?.name || "Carregando..."}
              </p>
              <p className="text-[10px] text-zinc-400 leading-none">
                {user?.roles?.[0] || "Usuário"}
              </p>
            </div>
            <ChevronDown className="hidden h-3.5 w-3.5 text-zinc-400 md:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-1.5 z-50 w-48 origin-top-right rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-1 shadow-lg">
              <div className="px-2 py-1.5 text-xs text-zinc-500 border-b border-zinc-200 dark:border-zinc-900 mb-1 truncate">
                {user?.email || ""}
              </div>
              <Link
                href="/settings"
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              >
                <UserIcon className="h-3.5 w-3.5" />
                <span>Meu Perfil</span>
              </Link>
              <button
                onClick={() => logout()}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sair</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
