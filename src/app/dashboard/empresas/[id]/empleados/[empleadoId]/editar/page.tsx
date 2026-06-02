// Editar empleado
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { empresaAccesible } from "@/lib/accesoEmpresas";
import { editarEmpleado } from "../../actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function EditarEmpleadoPage({
  params,
}: {
  params: Promise<{ id: string; empleadoId: string }>;
}) {
  const { id, empleadoId } = await params;

  // Verificar empresa y empleado (del estudio del usuario)
  const sesion = await auth();
  const empresa = sesion?.user ? await empresaAccesible(sesion.user, id) : null;
  if (!empresa) notFound();

  const empleado = await prisma.empleado.findFirst({
    where: { id: empleadoId, empresaId: id },
  });
  if (!empleado) notFound();

  return (
    <main className="max-w-2xl mx-auto px-8 py-10">
      <Link href={`/dashboard/empresas/${id}/empleados`} className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-sm">
        <ArrowLeft size={14} /> Volver a empleados
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">Editar empleado</h1>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8">
        <form action={editarEmpleado.bind(null, id, empleadoId)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rut" className="text-slate-300">RUT (no editable)</Label>
            <Input id="rut" defaultValue={empleado.rut} disabled
              className="bg-slate-900 border-slate-700 text-slate-500 cursor-not-allowed" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cargo" className="text-slate-300">Cargo</Label>
            <Input id="cargo" name="cargo" defaultValue={empleado.cargo ?? ""}
              className="bg-slate-700 border-slate-600 text-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nombre" className="text-slate-300">Nombre <span className="text-red-400">*</span></Label>
            <Input id="nombre" name="nombre" defaultValue={empleado.nombre} required
              className="bg-slate-700 border-slate-600 text-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apellido" className="text-slate-300">Apellido <span className="text-red-400">*</span></Label>
            <Input id="apellido" name="apellido" defaultValue={empleado.apellido} required
              className="bg-slate-700 border-slate-600 text-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sueldoBase" className="text-slate-300">Sueldo base (CLP) <span className="text-red-400">*</span></Label>
            <Input id="sueldoBase" name="sueldoBase" type="number" defaultValue={empleado.sueldoBase} required min="0"
              className="bg-slate-700 border-slate-600 text-white" />
          </div>
          <div className="md:col-span-2 flex items-center gap-3">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold">
              Guardar cambios
            </Button>
            <Link href={`/dashboard/empresas/${id}/empleados`} className="text-slate-400 hover:text-white text-sm">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
