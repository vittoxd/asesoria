// Dashboard principal — solo accesible con sesión activa
import Link from "next/link";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { obtenerServicioSII } from "@/lib/services/sii";
import { formatearFecha } from "@/lib/formato";

// Calcula la fecha del próximo día 12 (vencimiento del F29)
function proximoVencimiento(): Date {
  const hoy = new Date();
  // Si ya pasó el 12 de este mes, el próximo es el 12 del mes que viene
  if (hoy.getDate() > 12) {
    return new Date(hoy.getFullYear(), hoy.getMonth() + 1, 12);
  }
  return new Date(hoy.getFullYear(), hoy.getMonth(), 12);
}

export default async function DashboardPage() {
  const sesion = await auth();
  const usuario = sesion?.user;
  const estudioId = usuario?.estudioId;

  // 1. Traer las empresas del estudio
  const empresas = estudioId
    ? await prisma.empresa.findMany({
        where: { estudioId },
        orderBy: { creadoEn: "desc" },
      })
    : [];

  // 2. Para cada empresa, consultar su situación tributaria (mock) en paralelo
  const sii = obtenerServicioSII();
  const situaciones = await Promise.all(
    empresas.map((e) => sii.obtenerSituacionTributaria(e.rut))
  );

  // 3. Calcular los números del resumen
  const totalEmpresas = empresas.length;
  const conDeuda = situaciones.filter((s) => !s.alDia).length;
  const venc = proximoVencimiento();

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-lg">AsesorIA</span>
            {usuario?.estudioNombre && (
              <span className="text-slate-500 text-sm">· {usuario.estudioNombre}</span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm">{usuario?.email}</span>
            <form action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}>
              <button type="submit" className="text-slate-400 hover:text-white text-sm transition-colors">
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Bienvenido, {usuario?.name} 👋</h1>
          <p className="text-slate-400 mt-1">
            Rol: <span className="text-blue-400 font-medium">{usuario?.rol}</span>
          </p>
        </div>

        {/* Cards de resumen con datos reales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <p className="text-slate-400 text-sm mb-1">Empresas activas</p>
            <p className="text-3xl font-bold">{totalEmpresas}</p>
            <Link href="/dashboard/empresas" className="text-blue-400 hover:text-blue-300 text-xs mt-2 inline-block">
              Ver empresas →
            </Link>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <p className="text-slate-400 text-sm mb-1">Empresas con deuda SII</p>
            <p className={`text-3xl font-bold ${conDeuda > 0 ? "text-yellow-400" : "text-green-400"}`}>
              {conDeuda}
            </p>
            <p className="text-slate-500 text-xs mt-2">
              {conDeuda > 0 ? "Requieren atención" : "Todas al día ✓"}
            </p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <p className="text-slate-400 text-sm mb-1">Próximo vencimiento F29</p>
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
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              + Agregar empresa
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
                      <span className="text-green-400 text-xs">✓ Al día con el SII</span>
                    ) : (
                      <span className="text-yellow-400 text-xs">⚠ Con deuda SII</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
