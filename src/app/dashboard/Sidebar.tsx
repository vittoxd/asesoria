"use client";

// ─────────────────────────────────────────────────────────────
// SIDEBAR — menú lateral de navegación (Client Component)
// Usa usePathname() para saber en qué página estás y resaltar
// el link activo. Eso solo funciona en el navegador → "use client".
// ─────────────────────────────────────────────────────────────

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Building2,
  Users,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";

// Links activos (los que ya existen)
const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/empresas", label: "Empresas", icon: Building2 },
];

// Links futuros (visibles pero deshabilitados, dan sensación de producto)
const NAV_FUTURO = [
  { label: "Remuneraciones", icon: Users },
  { label: "Alertas", icon: Bell },
  { label: "Configuración", icon: Settings },
];

export function Sidebar({
  nombre,
  email,
  estudioNombre,
}: {
  nombre: string;
  email: string;
  estudioNombre: string | null;
}) {
  const pathname = usePathname();

  // Saber si un link está activo (la página actual)
  function esActivo(href: string): boolean {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <aside className="w-64 shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-bold">A</span>
          </div>
          <div>
            <p className="font-bold text-white leading-tight">AsesorIA</p>
            {estudioNombre && (
              <p className="text-slate-500 text-xs leading-tight">{estudioNombre}</p>
            )}
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map((item) => {
          const Icono = item.icon;
          const activo = esActivo(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activo
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Icono size={18} />
              {item.label}
            </Link>
          );
        })}

        {/* Separador */}
        <div className="pt-4 pb-2 px-3">
          <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider">
            Próximamente
          </p>
        </div>

        {NAV_FUTURO.map((item) => {
          const Icono = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 cursor-not-allowed"
            >
              <Icono size={18} />
              {item.label}
            </div>
          );
        })}
      </nav>

      {/* Usuario + logout */}
      <div className="border-t border-slate-800 p-3">
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-white truncate">{nombre}</p>
          <p className="text-xs text-slate-500 truncate">{email}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
