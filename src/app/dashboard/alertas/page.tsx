// Alertas: vencimientos del F29 y empresas con deuda SII
// Se calculan dinámicamente desde las empresas del estudio.
import Link from "next/link";
import { auth } from "@/auth";
import { empresasVisibles } from "@/lib/accesoEmpresas";
import { obtenerServicioSII } from "@/lib/services/sii";
import { formatearCLP, formatearFecha } from "@/lib/formato";
import { AlertTriangle, CalendarClock, CheckCircle2 } from "lucide-react";

// Próximo día 12 (vencimiento F29)
function proximoVencimiento(): Date {
  const hoy = new Date();
  if (hoy.getDate() > 12) {
    return new Date(hoy.getFullYear(), hoy.getMonth() + 1, 12);
  }
  return new Date(hoy.getFullYear(), hoy.getMonth(), 12);
}

export default async function AlertasPage() {
  const sesion = await auth();
  const empresas = sesion?.user ? await empresasVisibles(sesion.user) : [];

  const sii = obtenerServicioSII();
  const situaciones = await Promise.all(empresas.map((e) => sii.obtenerSituacionTributaria(e.rut)));

  const venc = proximoVencimiento();

  // Armamos la lista de alertas
  const empresasConDeuda = empresas
    .map((e, i) => ({ empresa: e, situacion: situaciones[i] }))
    .filter((x) => !x.situacion.alDia);

  return (
    <main className="max-w-4xl mx-auto px-8 py-10">
      <h1 className="text-2xl font-bold mb-1">Alertas</h1>
      <p className="text-slate-500 text-sm mb-6">Vencimientos y temas que requieren tu atención.</p>

      {/* Vencimiento F29 (aplica a todas) */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-yellow-500/10 rounded-full flex items-center justify-center shrink-0">
            <CalendarClock size={20} className="text-yellow-400" />
          </div>
          <div>
            <p className="font-medium">Vencimiento F29 (IVA mensual)</p>
            <p className="text-slate-400 text-sm mt-0.5">
              Todas las empresas deben declarar antes del{" "}
              <span className="text-yellow-400 font-medium">{formatearFecha(venc.toISOString())}</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Empresas con deuda */}
      <h2 className="text-sm font-semibold text-slate-400 uppercase mb-3">Empresas con deuda SII</h2>

      {empresasConDeuda.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center">
          <CheckCircle2 size={28} className="text-green-400 mx-auto mb-2" />
          <p className="text-slate-400">Todas tus empresas están al día con el SII. 🎉</p>
        </div>
      ) : (
        <div className="space-y-3">
          {empresasConDeuda.map(({ empresa, situacion }) => (
            <Link
              key={empresa.id}
              href={`/dashboard/empresas/${empresa.id}`}
              className="flex items-center justify-between bg-slate-800 rounded-2xl border border-slate-700 p-5 hover:border-red-500/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center shrink-0">
                  <AlertTriangle size={20} className="text-red-400" />
                </div>
                <div>
                  <p className="font-medium">{empresa.razonSocial}</p>
                  <p className="text-slate-500 text-sm">{empresa.rut}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-red-400 font-semibold">{formatearCLP(situacion.deudaFiscal)}</p>
                <p className="text-slate-500 text-xs">deuda fiscal</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
