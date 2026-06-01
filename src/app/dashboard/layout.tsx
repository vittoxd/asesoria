// ─────────────────────────────────────────────────────────────
// LAYOUT DEL DASHBOARD
// Este layout envuelve TODAS las páginas dentro de /dashboard.
// Pone el sidebar a la izquierda y el contenido a la derecha.
// Se escribe una sola vez y aplica a todo automáticamente.
// ─────────────────────────────────────────────────────────────

import { auth } from "@/auth";
import { Sidebar } from "./Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // El layout es Server Component: puede leer la sesión
  const sesion = await auth();
  const usuario = sesion?.user;

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* Sidebar (recibe los datos del usuario) */}
      <Sidebar
        nombre={usuario?.name ?? "Usuario"}
        email={usuario?.email ?? ""}
        estudioNombre={usuario?.estudioNombre ?? null}
      />

      {/* Contenido de cada página */}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
