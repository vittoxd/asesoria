// Liquidaciones de sueldo de una empresa, por período
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { empresaAccesible } from "@/lib/accesoEmpresas";
import { formatearCLP, formatearPeriodo } from "@/lib/formato";
import { ControlesLiquidacion } from "./ControlesLiquidacion";
import { ArrowLeft, Wallet } from "lucide-react";

// Período por defecto: el mes actual en formato "YYYY-MM"
function periodoActual(): string {
  const hoy = new Date();
  return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}`;
}

export default async function RemuneracionesPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ periodo?: string }>;
}) {
  const { id } = await params;
  const { periodo: periodoParam } = await searchParams;
  const periodo = periodoParam || periodoActual();

  // Verificar empresa (según el rol del usuario)
  const sesion = await auth();
  const empresa = sesion?.user ? await empresaAccesible(sesion.user, id) : null;

  if (!empresa) {
    notFound();
  }

  // Traer las liquidaciones del período, con el empleado de cada una
  const liquidaciones = await prisma.remuneracion.findMany({
    where: { empresaId: id, periodo },
    include: { empleado: true },
    orderBy: { creadoEn: "asc" },
  });

  // Totales (suma de cada columna)
  const totales = liquidaciones.reduce(
    (acc, l) => ({
      sueldoBase: acc.sueldoBase + l.sueldoBase,
      afp: acc.afp + (l.cotizacionAFP ?? 0),
      salud: acc.salud + (l.cotizacionSalud ?? 0),
      liquido: acc.liquido + (l.liquidoAPagar ?? 0),
    }),
    { sueldoBase: 0, afp: 0, salud: 0, liquido: 0 }
  );

  return (
    <main className="max-w-5xl mx-auto px-8 py-10">
      <Link
        href={`/dashboard/empresas/${id}`}
        className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-sm"
      >
        <ArrowLeft size={14} /> Volver a la empresa
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-1">Liquidaciones de sueldo</h1>
      <p className="text-slate-500 text-sm mb-6">
        {empresa.razonSocial} · {formatearPeriodo(periodo)}
      </p>

      {/* Controles: elegir mes + generar */}
      <ControlesLiquidacion empresaId={id} periodo={periodo} />

      {liquidaciones.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700 border-dashed rounded-2xl p-12 text-center">
          <div className="w-14 h-14 mx-auto bg-blue-500/10 rounded-2xl flex items-center justify-center mb-3">
            <Wallet className="text-blue-400" size={24} />
          </div>
          <p className="text-slate-400">
            No hay liquidaciones para {formatearPeriodo(periodo)}.
          </p>
          <p className="text-slate-500 text-sm mt-1">
            Aprieta &quot;Generar liquidaciones&quot; para calcularlas.
          </p>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-900/50 text-slate-400">
              <tr>
                <th className="text-left font-medium px-6 py-3">Empleado</th>
                <th className="text-right font-medium px-6 py-3">Sueldo base</th>
                <th className="text-right font-medium px-6 py-3">AFP (10%)</th>
                <th className="text-right font-medium px-6 py-3">Salud (7%)</th>
                <th className="text-right font-medium px-6 py-3">Líquido a pagar</th>
              </tr>
            </thead>
            <tbody>
              {liquidaciones.map((l) => (
                <tr key={l.id} className="border-t border-slate-700 hover:bg-slate-700/30">
                  <td className="px-6 py-4 font-medium">
                    {l.empleado.nombre} {l.empleado.apellido}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-300">{formatearCLP(l.sueldoBase)}</td>
                  <td className="px-6 py-4 text-right text-red-400">-{formatearCLP(l.cotizacionAFP ?? 0)}</td>
                  <td className="px-6 py-4 text-right text-red-400">-{formatearCLP(l.cotizacionSalud ?? 0)}</td>
                  <td className="px-6 py-4 text-right font-bold text-blue-400">{formatearCLP(l.liquidoAPagar ?? 0)}</td>
                </tr>
              ))}
            </tbody>
            {/* Fila de totales */}
            <tfoot className="bg-slate-900/50 font-semibold">
              <tr className="border-t border-slate-600">
                <td className="px-6 py-3">Totales</td>
                <td className="px-6 py-3 text-right">{formatearCLP(totales.sueldoBase)}</td>
                <td className="px-6 py-3 text-right text-red-400">-{formatearCLP(totales.afp)}</td>
                <td className="px-6 py-3 text-right text-red-400">-{formatearCLP(totales.salud)}</td>
                <td className="px-6 py-3 text-right text-blue-400">{formatearCLP(totales.liquido)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </main>
  );
}
