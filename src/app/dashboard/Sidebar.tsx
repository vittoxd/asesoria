"use client";

// ─────────────────────────────────────────────────────────────
// SIDEBAR responsive (Client Component)
// Desktop: barra lateral fija siempre visible.
// Móvil: barra superior con botón hamburguesa que abre un drawer.
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Building2,
  UserCog,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/empresas", label: "Empresas", icon: Building2 },
  { href: "/dashboard/alertas", label: "Alertas", icon: Bell },
];

// Links visibles solo para ADMIN/SUPERADMIN
const NAV_ADMIN = [
  { href: "/dashboard/usuarios", label: "Usuarios", icon: UserCog },
  { href: "/dashboard/configuracion", label: "Configuración", icon: Settings },
];

export function Sidebar({
  nombre,
  email,
  estudioNombre,
  rol,
}: {
  nombre: string;
  email: string;
  estudioNombre: string | null;
  rol: string;
}) {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false); // drawer móvil

  // Si es admin, sumamos los links de admin a la navegación
  const esAdmin = rol === "ADMIN" || rol === "SUPERADMIN";
  const navItems = esAdmin ? [...NAV, ...NAV_ADMIN] : NAV;

  function esActivo(href: string): boolean {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* ── Barra superior (solo móvil) ── */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">A</span>
          </div>
          <span className="font-bold text-white">AsesorIA</span>
        </div>
        <button onClick={() => setAbierto(true)} className="text-slate-300 hover:text-white">
          <Menu size={22} />
        </button>
      </div>

      {/* ── Fondo oscuro cuando el drawer está abierto (solo móvil) ── */}
      {abierto && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setAbierto(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed lg:sticky top-0 z-50 h-screen w-64 shrink-0
          bg-slate-900 border-r border-slate-800 flex flex-col
          transition-transform duration-300
          ${abierto ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        `}
      >
        {/* Logo + cerrar (móvil) */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
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
          <button
            onClick={() => setAbierto(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icono = item.icon;
            const activo = esActivo(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setAbierto(false)}
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
    </>
  );
}
