// Vista del CLIENTE: solo su propia empresa (situación SII, F29, multas)
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { obtenerServicioSII } from "@/lib/services/sii";
import { obtenerServicioDT } from "@/lib/services/dt";
import { formatearCLP, formatearPeriodo, formatearFecha } from "@/lib/formato";
import { Building2 } from "lucide-react";

export default async function MiEmpresaPage() {
  const sesion = await auth();
  const userId = sesion?.user?.id;

  // Buscar la empresa ligada a este cliente
  const usuario = userId
    ? await prisma.usuario.findUnique({
        where: { id: userId },
        select: { empresaClienteId: true },
      })
    : null;

  const empresa = usuario?.empresaClienteId
    ? await prisma.empresa.findUnique({ where: { id: usuario.empresaClienteId } })
    : null;

  if (!empresa) {
    return (
      <main className="max-w-3xl mx-auto px-8 py-10">
        <div className="bg-slate-800/50 border border-slate-700 border-dashed rounded-2xl p-16 text-center">
          <div className="w-16 h-16 mx-auto bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4">
            <Building2 className="text-blue-400" size={28} />
          </div>
          <h3 className="text-lg font-semibold text-white">Sin empresa asignada</h3>
          <p className="text-slate-400 text-sm mt-1">
            Tu cuenta aún no está ligada a una empresa. Contacta a tu contador.
          </p>
        </div>
      </main>
    );
  }

  const sii = obtenerServicioSII();
  const dt = obtenerServicioDT();
  const [situacion, f29, laboral] = await Promise.all([
    sii.obtenerSituacionTributaria(empresa.rut),
    sii.obtenerF29(empresa.rut, "2026-05"),
    dt.obtenerSituacionLaboral(empresa.rut),
  ]);

  return (
    <main className="max-w-3xl mx-auto px-8 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{empresa.razonSocial}</h1>
        <p className="text-slate-500 text-sm">{empresa.rut}</p>
      </div>

      {/* Estado SII */}
      <section className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
        <h2 className="text-sm font-semibold text-slate-400 uppercase mb-3">Estado tributario</h2>
        {situacion.alDia ? (
          <span className="inline-flex rounded-full bg-green-500/10 text-green-400 text-sm font-medium px-3 py-1">✓ Al día con el SII</span>
        ) : (
          <span className="inline-flex rounded-full bg-red-500/10 text-red-400 text-sm font-medium px-3 py-1">⚠ Con deuda: {formatearCLP(situacion.deudaFiscal)}</span>
        )}
      </section>

      {/* F29 del mes */}
      <section className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
        <h2 className="text-sm font-semibold text-slate-400 uppercase mb-4">F29 — {formatearPeriodo(f29.periodo)}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-slate-500">Total a pagar</p>
            <p className="font-bold text-blue-400 text-lg">{formatearCLP(f29.totalAPagar)}</p>
          </div>
          <div>
            <p className="text-slate-500">IVA determinado</p>
            <p className="font-medium">{formatearCLP(f29.ivaDeterminado)}</p>
          </div>
          <div>
            <p className="text-slate-500">Vence</p>
            <p className="font-medium">{formatearFecha(f29.fechaVencimiento)}</p>
          </div>
        </div>
      </section>

      {/* Situación laboral */}
      <section className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
        <h2 className="text-sm font-semibold text-slate-400 uppercase mb-4">Situación laboral</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-slate-500">Trabajadores</p>
            <p className="font-medium text-lg">{laboral.trabajadoresRegistrados}</p>
          </div>
          <div>
            <p className="text-slate-500">Cotizaciones</p>
            {laboral.cotizacionesAlDia ? (
              <span className="inline-flex rounded-full bg-green-500/10 text-green-400 text-xs font-medium px-2.5 py-1 mt-1">Al día</span>
            ) : (
              <span className="inline-flex rounded-full bg-red-500/10 text-red-400 text-xs font-medium px-2.5 py-1 mt-1">Pendientes</span>
            )}
          </div>
          <div>
            <p className="text-slate-500">Multas pendientes</p>
            <p className="font-medium text-lg">{laboral.multasPendientes}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
