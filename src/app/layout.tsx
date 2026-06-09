import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layouts/sidebar';
import { StoreInitializer } from '@/components/layouts/store-initializer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Click Marido Marketing Studio | Geração de Conteúdo com IA',
  description: 'Estúdio inteligente de criação e automação de marketing para a Click Marido Reparos Residenciais. Gere roteiros, storyboards e prompts de vídeo com IA.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full dark`}
    >
      <body className="min-h-full flex bg-zinc-950 text-zinc-100 antialiased overflow-hidden">
        <StoreInitializer>
          <div className="flex w-full h-screen overflow-hidden">
            {/* Sidebar Fixa */}
            <Sidebar />
            
            {/* Área Principal com Rolagem Independente */}
            <main className="flex-1 overflow-y-auto h-screen bg-zinc-950 relative">
              {children}
            </main>
          </div>
        </StoreInitializer>
      </body>
    </html>
  );
}
