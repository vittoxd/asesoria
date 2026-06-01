// ─────────────────────────────────────────────────────────────
// PÁGINA DE DETALLE DE UNA EMPRESA
// Muestra los datos de la empresa + la info que traen los
// servicios mock del SII y la Inspección del Trabajo.
// Aquí los mocks "cobran vida" en pantalla.
// ─────────────────────────────────────────────────────────────

import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { obtenerServicioSII } from "@/lib/services/sii";
import { obtenerServicioDT } from "@/lib/services/dt";
import { formatearCLP, formatearPeriodo, formatearFecha } from "@/lib/formato";

export default async function DetalleEmpresaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. Buscar la empresa (solo si es del estudio del usuario)
  const sesion = await auth();
  const estudioId = sesion?.user?.estudioId;
  const empresa = estudioId
    ? await prisma.empresa.findFirst({ where: { id, estudioId } })
    : null;

  if (!empresa) {
    notFound();
  }

  // 2. Pedir los servicios (nos dan los mocks) y llamar en paralelo
  const sii = obtenerServicioSII();
  const dt = obtenerServicioDT();

  const [situacion, f29, historial, laboral] = await Promise.all([
    sii.obtenerSituacionTributaria(empresa.rut),
    sii.obtenerF29(empresa.rut, "2026-05"),
    sii.obtenerHistorialF29(empresa.rut, 6),
    dt.obtenerSituacionLaboral(empresa.rut),
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Encabezado */}
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/empresas" className="text-slate-400 hover:text-white text-sm">
              ← Volver
            </Link>
            <span className="font-bold text-lg">{empresa.razonSocial}</span>
          </div>
          <Link
            href={`/dashboard/empresas/${empresa.id}/editar`}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            Editar
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* ── Datos básicos de la empresa ── */}
        <section className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <h2 className="text-sm font-semibold text-slate-400 uppercase mb-3">Datos de la empresa</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-slate-500">RUT</p>
              <p className="font-medium">{empresa.rut}</p>
            </div>
            <div>
              <p className="text-slate-500">Giro</p>
              <p className="font-medium">{empresa.giro ?? "—"}</p>
            </div>
            <div>
              <p className="text-slate-500">Comuna</p>
              <p className="font-medium">{empresa.comuna ?? "—"}</p>
            </div>
            <div>
              <p className="text-slate-500">Régimen (SII)</p>
              <p className="font-medium">{situacion.regimen}</p>
            </div>
          </div>
        </section>

        {/* ── Situación tributaria + F29 del mes ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Estado SII */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <h2 className="text-sm font-semibold text-slate-400 uppercase mb-3">Estado SII</h2>
            {situacion.alDia ? (
              <p className="text-green-400 font-semibold text-lg">✓ Al día</p>
            ) : (
              <p className="text-red-400 font-semibold text-lg">⚠ Con deuda</p>
            )}
            <p className="text-slate-400 text-sm mt-2">
              Deuda fiscal: {formatearCLP(situacion.deudaFiscal)}
            </p>
          </div>

          {/* F29 del mes */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 md:col-span-2">
            <h2 className="text-sm font-semibold text-slate-400 uppercase mb-3">
              F29 — {formatearPeriodo(f29.periodo)}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-slate-500">IVA Débito</p>
                <p className="font-medium">{formatearCLP(f29.ivaDebito)}</p>
              </div>
              <div>
                <p className="text-slate-500">IVA Crédito</p>
                <p className="font-medium">{formatearCLP(f29.ivaCredito)}</p>
              </div>
              <div>
                <p className="text-slate-500">PPM</p>
                <p className="font-medium">{formatearCLP(f29.ppm)}</p>
              </div>
              <div>
                <p className="text-slate-500">Total a pagar</p>
                <p className="font-bold text-blue-400">{formatearCLP(f29.totalAPagar)}</p>
              </div>
            </div>
            <p className="text-slate-500 text-xs mt-3">
              Vence el {formatearFecha(f29.fechaVencimiento)}
            </p>
          </div>
        </div>

        {/* ── Historial F29 ── */}
        <section className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
          <h2 className="text-sm font-semibold text-slate-400 uppercase px-6 pt-6 pb-3">
            Historial F29 (últimos 6 meses)
          </h2>
          <table className="w-full text-sm">
            <thead className="bg-slate-900/50 text-slate-400">
              <tr>
                <th className="text-left font-medium px-6 py-2">Período</th>
                <th className="text-right font-medium px-6 py-2">Ventas</th>
                <th className="text-right font-medium px-6 py-2">IVA determinado</th>
                <th className="text-right font-medium px-6 py-2">Total a pagar</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((mes) => (
                <tr key={mes.periodo} className="border-t border-slate-700">
                  <td className="px-6 py-3">{formatearPeriodo(mes.periodo)}</td>
                  <td className="px-6 py-3 text-right text-slate-300">{formatearCLP(mes.ventasNetas)}</td>
                  <td className="px-6 py-3 text-right text-slate-300">{formatearCLP(mes.ivaDeterminado)}</td>
                  <td className="px-6 py-3 text-right font-medium">{formatearCLP(mes.totalAPagar)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ── Inspección del Trabajo ── */}
        <section className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <h2 className="text-sm font-semibold text-slate-400 uppercase mb-4">Inspección del Trabajo</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
            <div>
              <p className="text-slate-500">Trabajadores</p>
              <p className="font-medium text-lg">{laboral.trabajadoresRegistrados}</p>
            </div>
            <div>
              <p className="text-slate-500">Cotizaciones</p>
              {laboral.cotizacionesAlDia ? (
                <p className="font-medium text-green-400">✓ Al día</p>
              ) : (
                <p className="font-medium text-red-400">⚠ Pendientes</p>
              )}
            </div>
            <div>
              <p className="text-slate-500">Multas pendientes</p>
              <p className="font-medium text-lg">
                {laboral.multasPendientes}{" "}
                {laboral.montoMultasPendientes > 0 && (
                  <span className="text-red-400 text-sm">
                    ({formatearCLP(laboral.montoMultasPendientes)})
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Lista de multas si hay */}
          {laboral.multas.length > 0 && (
            <div className="border-t border-slate-700 pt-4 space-y-2">
              {laboral.multas.map((multa) => (
                <div key={multa.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{multa.motivo}</p>
                    <p className="text-slate-500 text-xs">{formatearFecha(multa.fecha)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatearCLP(multa.monto)}</p>
                    <span
                      className={
                        multa.estado === "pendiente"
                          ? "text-red-400 text-xs"
                          : multa.estado === "pagada"
                          ? "text-green-400 text-xs"
                          : "text-yellow-400 text-xs"
                      }
                    >
                      {multa.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
