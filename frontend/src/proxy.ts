import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Lê o cookie que sinaliza a presença de sessão ativa (Refresh Token no cookie)
  const hasSession = request.cookies.has("clickmarido_session_active");

  const authRoutes = ["/login", "/esqueci-senha", "/recuperar-senha"];
  const isAuthRoute = authRoutes.includes(pathname);
  
  // Rotas estáticas ou de assets que não devem ser interceptadas
  const isAssetRoute = pathname.includes(".") || pathname.startsWith("/_next/");

  if (isAssetRoute) {
    return NextResponse.next();
  }

  // Se o usuário não está autenticado e tenta acessar rota privada, redireciona para login
  if (!hasSession && !isAuthRoute) {
    // Evita loop no redirecionamento do path raiz /
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Se o usuário já está autenticado e tenta acessar tela de login, redireciona para dashboard
  if (hasSession && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redireciona o path raiz "/" para o dashboard se tiver sessão
  if (pathname === "/" && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Intercepta todas as rotas exceto arquivos estáticos, favicon e rotas da pasta /public
     */
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)",
  ],
};
