// Editar empresa — dentro del layout con sidebar
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { actualizarEmpresa } from "../../actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function EditarEmpresaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const sesion = await auth();
  const estudioId = sesion?.user?.estudioId;
  const empresa = estudioId
    ? await prisma.empresa.findFirst({ where: { id, estudioId } })
    : null;

  if (!empresa) {
    notFound();
  }

  return (
    <main className="max-w-2xl mx-auto px-8 py-10">
      <Link
        href="/dashboard/empresas"
        className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-sm"
      >
        <ArrowLeft size={14} /> Volver a empresas
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">Editar empresa</h1>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8">
        <form action={actualizarEmpresa.bind(null, empresa.id)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="rut" className="text-slate-300">RUT (no editable)</Label>
            <Input
              id="rut"
              defaultValue={empresa.rut}
              disabled
              className="bg-slate-900 border-slate-700 text-slate-500 cursor-not-allowed"
            />
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="giro" className="text-slate-300">Giro</Label>
            <Input
              id="giro"
              name="giro"
              defaultValue={empresa.giro ?? ""}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comuna" className="text-slate-300">Comuna</Label>
            <Input
              id="comuna"
              name="comuna"
              defaultValue={empresa.comuna ?? ""}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold">
              Guardar cambios
            </Button>
            <Link href="/dashboard/empresas" className="text-slate-400 hover:text-white text-sm">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
