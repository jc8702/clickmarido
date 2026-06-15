import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeInitializer } from "@/components/theme-initializer";
import { AuthProvider } from "@/contexts/auth-context";
import { NextAuthProvider } from "@/components/providers/next-auth-provider";
import { SWRProvider } from "@/components/providers/swr-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { WebVitals } from "@/components/web-vitals";
import { AccessibilityChecker } from "@/components/accessibility-checker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Click Marido ERP + CRM | Gestão SaaS",
  description: "Fundação completa do sistema de CRM + ERP da Click Marido.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full h-screen overflow-hidden bg-background text-foreground antialiased font-sans">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:font-semibold focus:text-sm">
          Pular para o conteúdo principal
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeInitializer>
            <SWRProvider>
              <NextAuthProvider>
                <AuthProvider>
                  <AccessibilityChecker>
                    {children}
                  </AccessibilityChecker>
                </AuthProvider>
                <Analytics />
                <SpeedInsights />
                <WebVitals />
              </NextAuthProvider>
            </SWRProvider>
          </ThemeInitializer>
        </ThemeProvider>
      </body>
    </html>
  );
}
