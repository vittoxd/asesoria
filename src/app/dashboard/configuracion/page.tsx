// Configuración del estudio
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { actualizarEstudio } from "./actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default async function ConfiguracionPage() {
  const sesion = await auth();
  const estudioId = sesion?.user?.estudioId;
  const esAdmin = sesion?.user?.rol === "ADMIN" || sesion?.user?.rol === "SUPERADMIN";

  const estudio = estudioId
    ? await prisma.estudio.findUnique({ where: { id: estudioId } })
    : null;

  return (
    <main className="max-w-2xl mx-auto px-8 py-10">
      <h1 className="text-2xl font-bold mb-1">Configuración</h1>
      <p className="text-slate-500 text-sm mb-6">Datos de tu estudio contable.</p>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8">
        <form action={actualizarEstudio} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="nombre" className="text-slate-300">Nombre del estudio <span className="text-red-400">*</span></Label>
            <Input id="nombre" name="nombre" defaultValue={estudio?.nombre ?? ""} required disabled={!esAdmin}
              className="bg-slate-700 border-slate-600 text-white disabled:opacity-60" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rut" className="text-slate-300">RUT del estudio</Label>
            <Input id="rut" name="rut" defaultValue={estudio?.rut ?? ""} disabled={!esAdmin}
              className="bg-slate-700 border-slate-600 text-white disabled:opacity-60" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefono" className="text-slate-300">Teléfono</Label>
            <Input id="telefono" name="telefono" defaultValue={estudio?.telefono ?? ""} disabled={!esAdmin}
              className="bg-slate-700 border-slate-600 text-white disabled:opacity-60" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="direccion" className="text-slate-300">Dirección</Label>
            <Input id="direccion" name="direccion" defaultValue={estudio?.direccion ?? ""} disabled={!esAdmin}
              className="bg-slate-700 border-slate-600 text-white disabled:opacity-60" />
          </div>

          {esAdmin ? (
            <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold">
              Guardar cambios
            </Button>
          ) : (
            <p className="text-slate-500 text-sm">Solo un administrador puede editar estos datos.</p>
          )}
        </form>
      </div>
    </main>
  );
}
