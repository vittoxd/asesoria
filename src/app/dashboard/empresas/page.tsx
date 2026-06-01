// ─────────────────────────────────────────────────────────────
// PÁGINA DE LISTA DE EMPRESAS
// Es un Server Component (async): se ejecuta en el servidor,
// busca las empresas en la base de datos y las muestra.
// El "Read" del CRUD.
// ─────────────────────────────────────────────────────────────

import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { eliminarEmpresa } from "./actions";

export default async function EmpresasPage() {
  // 1. Saber quién es el usuario y a qué estudio pertenece
  const sesion = await auth();
  const estudioId = sesion?.user?.estudioId;

  // 2. Buscar SOLO las empresas de su estudio (aislamiento multi-tenant)
  const empresas = estudioId
    ? await prisma.empresa.findMany({
        where: { estudioId },
        orderBy: { creadoEn: "desc" }, // las más nuevas primero
      })
    : [];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ── Encabezado ── */}
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-slate-400 hover:text-white text-sm">
              ← Volver
            </Link>
            <span className="font-bold text-lg">Empresas</span>
          </div>

          <Link
            href="/dashboard/empresas/nueva"
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            + Agregar empresa
          </Link>
        </div>
      </header>

      {/* ── Contenido ── */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {empresas.length === 0 ? (
          // Estado vacío: cuando todavía no hay empresas
          <div className="bg-slate-800/50 border border-slate-700 border-dashed rounded-2xl p-12 text-center">
            <p className="text-slate-400">Todavía no tienes empresas registradas.</p>
            <Link
              href="/dashboard/empresas/nueva"
              className="inline-block mt-4 text-blue-400 hover:text-blue-300 font-medium"
            >
              Agregar tu primera empresa →
            </Link>
          </div>
        ) : (
          // Tabla con las empresas
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
                    <td className="px-6 py-4 font-medium">{empresa.razonSocial}</td>
                    <td className="px-6 py-4 text-slate-300">{empresa.rut}</td>
                    <td className="px-6 py-4 text-slate-400">{empresa.giro ?? "—"}</td>
                    <td className="px-6 py-4 text-slate-400">{empresa.comuna ?? "—"}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/dashboard/empresas/${empresa.id}/editar`}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          Editar
                        </Link>

                        {/* Eliminar: form que llama a la server action con el id */}
                        <form action={eliminarEmpresa.bind(null, empresa.id)}>
                          <button
                            type="submit"
                            className="text-red-400 hover:text-red-300"
                          >
                            Eliminar
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
