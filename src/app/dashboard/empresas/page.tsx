// Lista de empresas — el sidebar ya vive en el layout
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { BotonEliminar } from "./BotonEliminar";
import { Plus, Pencil, Building2 } from "lucide-react";

export default async function EmpresasPage() {
  const sesion = await auth();
  const estudioId = sesion?.user?.estudioId;

  const empresas = estudioId
    ? await prisma.empresa.findMany({
        where: { estudioId },
        orderBy: { creadoEn: "desc" },
      })
    : [];

  return (
    <main className="max-w-7xl mx-auto px-8 py-10">
      {/* Encabezado de la página */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Empresas</h1>
        <Link
          href="/dashboard/empresas/nueva"
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} /> Agregar empresa
        </Link>
      </div>

      {empresas.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700 border-dashed rounded-2xl p-16 text-center">
          <div className="w-16 h-16 mx-auto bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4">
            <Building2 className="text-blue-400" size={28} />
          </div>
          <h3 className="text-lg font-semibold text-white">No tienes empresas todavía</h3>
          <p className="text-slate-400 text-sm mt-1 mb-5">
            Agrega tu primera empresa para empezar a gestionar sus declaraciones.
          </p>
          <Link
            href="/dashboard/empresas/nueva"
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} /> Agregar empresa
          </Link>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-900/50 text-slate-400">
              <tr>
                <th className="text-left font-medium px-6 py-3">Razón Social</th>
                <th className="text-left font-medium px-6 py-3">RUT</th>
                <th className="text-left font-medium px-6 py-3">Giro</th>
                <th className="text-left font-medium px-6 py-3">Comuna</th>
                <th className="text-right font-medium px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empresas.map((empresa) => (
                <tr key={empresa.id} className="border-t border-slate-700 hover:bg-slate-700/30">
                  <td className="px-6 py-4 font-medium">
                    <Link
                      href={`/dashboard/empresas/${empresa.id}`}
                      className="hover:text-blue-400 transition-colors"
                    >
                      {empresa.razonSocial}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{empresa.rut}</td>
                  <td className="px-6 py-4 text-slate-400">{empresa.giro ?? "—"}</td>
                  <td className="px-6 py-4 text-slate-400">{empresa.comuna ?? "—"}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-4">
                      <Link
                        href={`/dashboard/empresas/${empresa.id}/editar`}
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                      >
                        <Pencil size={14} /> Editar
                      </Link>
                      <BotonEliminar id={empresa.id} nombre={empresa.razonSocial} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
