// Middleware de autenticación y control de acceso por rol
// Se ejecuta en cada request antes de llegar a la página

import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Rutas que cada rol puede acceder
// Si una ruta no está aquí, solo necesita estar autenticado
const RUTAS_POR_ROL: Record<string, string[]> = {
  SUPERADMIN: ["/dashboard"],        // acceso total
  ADMIN: ["/dashboard"],             // acceso total a su estudio
  CONTADOR: ["/dashboard"],          // solo empresas asignadas
  CLIENTE: ["/dashboard/mi-empresa"], // solo su empresa
};

// Rutas exclusivas de ADMIN y SUPERADMIN
const RUTAS_SOLO_ADMIN = [
  "/dashboard/usuarios",
  "/dashboard/configuracion",
  "/dashboard/suscripcion",
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const sesion = req.auth;
  const rol = sesion?.user?.rol;

  // Rutas públicas — siempre accesibles
  const esRutaPublica = pathname === "/login" || pathname === "/";

  // Sin sesión → al login
  if (!sesion && !esRutaPublica) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Con sesión en login → al dashboard
  if (sesion && esRutaPublica) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // CLIENTE intenta entrar a rutas que no son las suyas
  if (rol === "CLIENTE" && pathname.startsWith("/dashboard") &&
      !pathname.startsWith("/dashboard/mi-empresa")) {
    return NextResponse.redirect(new URL("/dashboard/mi-empresa", req.url));
  }

  // CONTADOR intenta entrar a rutas de admin
  if (rol === "CONTADOR" && RUTAS_SOLO_ADMIN.some(r => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/"],
};
