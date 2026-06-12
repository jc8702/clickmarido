"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayout } from "./dashboard-layout";
import { useAuth } from "@/contexts/auth-context";
import { 
  LayoutDashboard, 
  Users, 
  Wrench, 
  FileText, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  X,
  ShieldCheck,
  Building,
  UserCheck,
  CalendarDays,
  HardHat,
  ClipboardList,
  Coins,
  Package,
  MessageSquare,
  DollarSign,
  Shield,
  ClipboardCheck,
  HeartHandshake,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { href: "/financeiro", label: "Financeiro", icon: DollarSign, permission: "financial:read" },
  { href: "/relatorios", label: "Relatórios", icon: BarChart3, permission: "financial:read" },
  { href: "/clientes", label: "Clientes", icon: Users, permission: "client:read" },
  { href: "/conversas", label: "Conversas", icon: MessageSquare, permission: "whatsapp:read" },
  { href: "/servicos", label: "Serviços", icon: Wrench, permission: "service:read" },
  { href: "/materiais", label: "Materiais", icon: Package, permission: "material:read" },
  { href: "/tecnicos", label: "Técnicos", icon: HardHat, permission: "technician:read" },
  { href: "/ordens-servico", label: "Ordens de Serviço", icon: ClipboardList, permission: "service:read" },
  { href: "/garantias", label: "Garantias", icon: Shield, permission: "service:read" },
  { href: "/pos-venda", label: "Pós-Venda", icon: HeartHandshake, permission: "service:read" },
  { href: "/orcamentos", label: "Orçamentos", icon: FileText, permission: "quote:read" },
  { href: "/agenda", label: "Agenda", icon: CalendarDays, permission: "service:read" },
  { href: "/empresas", label: "Empresas", icon: Building, permission: "*" },
  { href: "/usuarios", label: "Usuários", icon: UserCheck, permission: "user:read" },
  { href: "/settings", label: "Configurações", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { 
    sidebarOpen, 
    setSidebarOpen, 
    sidebarCollapsed, 
    setSidebarCollapsed 
  } = useLayout();

  // Filtra as opções do menu conforme as permissões do usuário autenticado
  const filteredMenuItems = menuItems.filter((item) => {
    if (!item.permission) return true;
    if (!user) return false;
    return user.permissions.includes(item.permission) || user.permissions.includes("*");
  });

  return (
    <>
      {/* OVERLAY PARA MOBILE: Clica para fechar a sidebar no celular */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-zinc-900/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-zinc-900 text-zinc-100 border-r border-zinc-800 transition-all duration-300 ease-in-out md:static",
          // Largura no Mobile
          sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-64 md:translate-x-0",
          // Largura no Desktop (Colapsado vs Expandido)
          sidebarCollapsed ? "md:w-20" : "md:w-64"
        )}
      >
        {/* HEADER / LOGO */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-zinc-800">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg select-none">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-zinc-950 font-black shadow-md shadow-amber-500/20">
              CM
            </span>
            <span
              className={cn(
                "transition-all duration-300 font-semibold tracking-wide truncate",
                sidebarCollapsed ? "md:opacity-0 md:w-0" : "opacity-100"
              )}
            >
              Click <span className="text-amber-500">Marido</span>
            </span>
          </Link>

          {/* Botão de Fechar no Mobile */}
          <button
            className="rounded-lg p-1.5 hover:bg-zinc-800 md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* NAVEGAÇÃO / LINKS */}
        <nav className="flex-1 space-y-1.5 px-3 py-4 overflow-y-auto">
          {filteredMenuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 relative group",
                  isActive
                    ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/10"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
                )}
                onClick={() => setSidebarOpen(false)} // Fecha no mobile ao clicar
              >
                <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-zinc-950" : "text-zinc-400 group-hover:text-zinc-200")} />
                
                <span
                  className={cn(
                    "transition-all duration-300 truncate",
                    sidebarCollapsed ? "md:opacity-0 md:w-0" : "opacity-100"
                  )}
                >
                  {item.label}
                </span>

                {/* Tooltip elegante quando colapsado no desktop */}
                {sidebarCollapsed && (
                  <div className="absolute left-16 hidden rounded bg-zinc-950 border border-zinc-800 px-2 py-1 text-xs text-zinc-100 shadow-md group-hover:md:block z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER DA SIDEBAR (BOTÃO DE toggle) */}
        <div className="p-3 border-t border-zinc-800 hidden md:block">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex w-full items-center justify-center rounded-lg py-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors"
            title={sidebarCollapsed ? "Expandir menu" : "Recolher menu"}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <div className="flex items-center gap-2 text-xs font-semibold select-none">
                <ChevronLeft className="h-5 w-5" />
                <span>Recolher Menu</span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
