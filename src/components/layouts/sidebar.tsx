'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FolderOpen, 
  Settings, 
  Wrench, 
  Database,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Novo Projeto', href: '/projects/new', icon: PlusCircle },
    { name: 'Templates', href: '/templates', icon: FolderOpen },
    { name: 'Configurações', href: '/settings', icon: Settings },
  ];

  return (
    <aside className={cn('flex flex-col w-64 bg-zinc-950 border-r border-zinc-900 h-screen sticky top-0', className)}>
      {/* Header / Logo */}
      <div className='flex items-center gap-3 px-6 py-5 border-b border-zinc-900'>
        <div className='flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 shadow-md shadow-blue-500/20 text-white font-bold text-lg'>
          <Wrench className="w-4 h-4 text-white animate-pulse" />
        </div>
        <div className='flex flex-col'>
          <span className='text-sm font-bold tracking-tight text-white'>Click Marido</span>
          <span className='text-xxs text-zinc-500 font-mono'>Marketing Studio</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className='flex-1 px-4 py-6 space-y-1 overflow-y-auto'>
        <div className='px-3 mb-2 text-xxs font-semibold tracking-wider text-zinc-500 uppercase font-mono'>
          Menu Principal
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group',
                isActive 
                  ? 'bg-zinc-900 text-white font-medium border-l-2 border-blue-500' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
              )}
            >
              <item.icon className={cn(
                'w-4 h-4 transition-colors',
                isActive ? 'text-blue-500' : 'text-zinc-500 group-hover:text-zinc-300'
              )} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Status da Stack / Rodapé */}
      <div className='p-4 border-t border-zinc-900 bg-zinc-950/50 space-y-3'>
        {/* Supabase Status */}
        <div className='flex items-center justify-between p-2 rounded-md bg-zinc-900/60 border border-zinc-800 text-xxs'>
          <span className='text-zinc-500 flex items-center gap-1.5 font-mono'>
            <Database className="w-3.5 h-3.5 text-emerald-500" />
            Supabase
          </span>
          <span className='px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold'>
            Ativo
          </span>
        </div>

        {/* AI Models Status */}
        <div className='flex items-center justify-between p-2 rounded-md bg-zinc-900/60 border border-zinc-800 text-xxs'>
          <span className='text-zinc-500 flex items-center gap-1.5 font-mono'>
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            AI Service
          </span>
          <span className='px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold'>
            Auto-Fallback
          </span>
        </div>

        {/* Profile Footer */}
        <div className='flex items-center gap-3 pt-2 border-t border-zinc-900/50'>
          <div className='w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-300'>
            CM
          </div>
          <div className='flex flex-col overflow-hidden'>
            <span className='text-xs font-semibold text-zinc-300 truncate'>Click Marido</span>
            <span className='text-xxs text-zinc-500 truncate'>admin@clickmarido.com</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
