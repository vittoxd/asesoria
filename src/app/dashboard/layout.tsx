// ─────────────────────────────────────────────────────────────
// LAYOUT DEL DASHBOARD
// Sidebar a la izquierda + contenido a la derecha.
// Incluye el sistema de toasts (Toaster + ToastNotifier).
// ─────────────────────────────────────────────────────────────

import { Suspense } from "react";
import { Toaster } from "sonner";
import { auth } from "@/auth";
import { Sidebar } from "./Sidebar";
import { ToastNotifier } from "./ToastNotifier";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sesion = await auth();
  const usuario = sesion?.user;

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar
        nombre={usuario?.name ?? "Usuario"}
        email={usuario?.email ?? ""}
        estudioNombre={usuario?.estudioNombre ?? null}
      />

      <div className="flex-1 min-w-0 pt-14 lg:pt-0">{children}</div>

      {/* Sistema de toasts */}
      <Toaster theme="dark" position="top-right" richColors />
      <Suspense>
        <ToastNotifier />
      </Suspense>
    </div>
  );
}
