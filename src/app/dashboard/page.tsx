// Dashboard principal — el sidebar y el logout ahora viven en layout.tsx
import Link from "next/link";
import { auth } from "@/auth";
import { empresasVisibles } from "@/lib/accesoEmpresas";
import { obtenerServicioSII } from "@/lib/services/sii";
import { formatearFecha } from "@/lib/formato";
import { Building2, AlertTriangle, CalendarClock, Plus } from "lucide-react";

// Calcula la fecha del próximo día 12 (vencimiento del F29)
function proximoVencimiento(): Date {
  const hoy = new Date();
  if (hoy.getDate() > 12) {
    return new Date(hoy.getFullYear(), hoy.getMonth() + 1, 12);
  }
  return new Date(hoy.getFullYear(), hoy.getMonth(), 12);
}

export default async function DashboardPage() {
  const sesion = await auth();
  const usuario = sesion?.user;

  // Empresas visibles según el rol (admin: todas, contador: asignadas, cliente: la suya)
  const empresas = usuario ? await empresasVisibles(usuario) : [];

  const sii = obtenerServicioSII();
  const situaciones = await Promise.all(
    empresas.map((e) => sii.obtenerSituacionTributaria(e.rut))
  );

  const totalEmpresas = empresas.length;
  const conDeuda = situaciones.filter((s) => !s.alDia).length;
  const venc = proximoVencimiento();

  return (
    <main className="max-w-7xl mx-auto px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Bienvenido, {usuario?.name} 👋</h1>
        <p className="text-slate-400 mt-1">
          Rol: <span className="text-blue-400 font-medium">{usuario?.rol}</span>
        </p>
      </div>

      {/* Cards de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <Building2 size={16} /> Empresas activas
          </div>
          <p className="text-3xl font-bold">{totalEmpresas}</p>
          <Link href="/dashboard/empresas" className="text-blue-400 hover:text-blue-300 text-xs mt-2 inline-block">
            Ver empresas →
          </Link>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <AlertTriangle size={16} /> Empresas con deuda SII
          </div>
          <p className={`text-3xl font-bold ${conDeuda > 0 ? "text-yellow-400" : "text-green-400"}`}>
            {conDeuda}
          </p>
          <p className="text-slate-500 text-xs mt-2">
            {conDeuda > 0 ? "Requieren atención" : "Todas al día ✓"}
          </p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <CalendarClock size={16} /> Próximo vencimiento F29
          </div>
          <p className="text-3xl font-bold text-red-400">{formatearFecha(venc.toISOString())}</p>
          <p className="text-slate-500 text-xs mt-2">Declaración mensual de IVA</p>
        </div>
      </div>

      {/* Lista de empresas */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Tus empresas</h2>
          <Link
            href="/dashboard/empresas/nueva"
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} /> Agregar empresa
          </Link>
        </div>

        {empresas.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700 border-dashed rounded-2xl p-10 text-center">
            <p className="text-slate-400">Todavía no tienes empresas registradas.</p>
            <Link href="/dashboard/empresas/nueva" className="inline-block mt-3 text-blue-400 hover:text-blue-300 font-medium">
              Agregar tu primera empresa →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {empresas.map((empresa, i) => (
              <Link
                key={empresa.id}
                href={`/dashboard/empresas/${empresa.id}`}
                className="bg-slate-800 rounded-2xl border border-slate-700 p-5 hover:border-blue-500 transition-colors"
              >
                <p className="font-medium">{empresa.razonSocial}</p>
                <p className="text-slate-500 text-sm">{empresa.rut}</p>
                <div className="mt-3">
                  {situaciones[i].alDia ? (
                    <span className="inline-flex items-center rounded-full bg-green-500/10 text-green-400 text-xs font-medium px-2.5 py-1">
                      Al día con el SII
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-medium px-2.5 py-1">
                      Con deuda SII
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
