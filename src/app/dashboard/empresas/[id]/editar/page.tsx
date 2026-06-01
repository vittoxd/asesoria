// ─────────────────────────────────────────────────────────────
// PÁGINA DE EDITAR EMPRESA
// La carpeta [id] es un "parámetro dinámico": la URL trae el id
// de la empresa a editar (ej: /dashboard/empresas/abc123/editar).
// Buscamos esa empresa, rellenamos el form y al guardar llamamos
// a la server action actualizarEmpresa.
// ─────────────────────────────────────────────────────────────

import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { actualizarEmpresa } from "../../actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// En Next.js los params llegan como Promise, por eso se usa await
export default async function EditarEmpresaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. Saber a qué estudio pertenece el usuario
  const sesion = await auth();
  const estudioId = sesion?.user?.estudioId;

  // 2. Buscar la empresa SOLO si es de su estudio (seguridad)
  const empresa = estudioId
    ? await prisma.empresa.findFirst({
        where: { id, estudioId },
      })
    : null;

  // 3. Si no existe o no es suya → página 404
  if (!empresa) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Encabezado */}
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link href="/dashboard/empresas" className="text-slate-400 hover:text-white text-sm">
            ← Volver
          </Link>
          <span className="font-bold text-lg">Editar empresa</span>
        </div>
      </header>

      {/* Formulario */}
      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8">
          {/*
            actualizarEmpresa recibe (id, formData). Con .bind(null, id)
            pre-llenamos el id, igual que hicimos con eliminar.
          */}
          <form action={actualizarEmpresa.bind(null, empresa.id)} className="space-y-5">

            {/* RUT: se muestra pero NO se puede editar (es el identificador) */}
            <div className="space-y-2">
              <Label htmlFor="rut" className="text-slate-300">
                RUT (no editable)
              </Label>
              <Input
                id="rut"
                defaultValue={empresa.rut}
                disabled
                className="bg-slate-900 border-slate-700 text-slate-500 cursor-not-allowed"
              />
            </div>

            {/* Razón social (prellenada) */}
            <div className="space-y-2">
              <Label htmlFor="razonSocial" className="text-slate-300">
                Razón social <span className="text-red-400">*</span>
              </Label>
              <Input
                id="razonSocial"
                name="razonSocial"
                defaultValue={empresa.razonSocial}
                required
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            {/* Giro (prellenado) */}
            <div className="space-y-2">
              <Label htmlFor="giro" className="text-slate-300">
                Giro
              </Label>
              <Input
                id="giro"
                name="giro"
                defaultValue={empresa.giro ?? ""}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            {/* Comuna (prellenada) */}
            <div className="space-y-2">
              <Label htmlFor="comuna" className="text-slate-300">
                Comuna
              </Label>
              <Input
                id="comuna"
                name="comuna"
                defaultValue={empresa.comuna ?? ""}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            {/* Botones */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold"
              >
                Guardar cambios
              </Button>
              <Link
                href="/dashboard/empresas"
                className="text-slate-400 hover:text-white text-sm"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
