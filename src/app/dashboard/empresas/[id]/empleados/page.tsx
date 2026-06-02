// Gestión de empleados de una empresa
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { crearEmpleado } from "./actions";
import { BotonEliminarEmpleado } from "./BotonEliminarEmpleado";
import { formatearCLP } from "@/lib/formato";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";

export default async function EmpleadosPage({
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

  const empleados = await prisma.empleado.findMany({
    where: { empresaId: id },
    orderBy: { creadoEn: "desc" },
  });

  return (
    <main className="max-w-5xl mx-auto px-8 py-10">
      {/* Encabezado */}
      <Link
        href={`/dashboard/empresas/${id}`}
        className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-sm"
      >
        <ArrowLeft size={14} /> Volver a la empresa
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-1">Empleados</h1>
      <p className="text-slate-500 text-sm mb-6">{empresa.razonSocial}</p>

      {/* Formulario para agregar */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 mb-6">
        <h2 className="text-sm font-semibold text-slate-400 uppercase mb-4">Agregar empleado</h2>
        <form action={crearEmpleado.bind(null, id)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rut" className="text-slate-300">RUT <span className="text-red-400">*</span></Label>
            <Input id="rut" name="rut" placeholder="12.345.678-9" required
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cargo" className="text-slate-300">Cargo</Label>
            <Input id="cargo" name="cargo" placeholder="Cajero"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nombre" className="text-slate-300">Nombre <span className="text-red-400">*</span></Label>
            <Input id="nombre" name="nombre" placeholder="Juan" required
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apellido" className="text-slate-300">Apellido <span className="text-red-400">*</span></Label>
            <Input id="apellido" name="apellido" placeholder="Pérez" required
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sueldoBase" className="text-slate-300">Sueldo base (CLP) <span className="text-red-400">*</span></Label>
            <Input id="sueldoBase" name="sueldoBase" type="number" placeholder="500000" required min="0"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fechaIngreso" className="text-slate-300">Fecha de ingreso <span className="text-red-400">*</span></Label>
            <Input id="fechaIngreso" name="fechaIngreso" type="date" required
              className="bg-slate-700 border-slate-600 text-white" />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold">
              Agregar empleado
            </Button>
          </div>
        </form>
      </div>

      {/* Lista de empleados */}
      {empleados.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700 border-dashed rounded-2xl p-12 text-center">
          <div className="w-14 h-14 mx-auto bg-blue-500/10 rounded-2xl flex items-center justify-center mb-3">
            <Users className="text-blue-400" size={24} />
          </div>
          <p className="text-slate-400">Aún no hay empleados en esta empresa.</p>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-900/50 text-slate-400">
              <tr>
                <th className="text-left font-medium px-6 py-3">Nombre</th>
                <th className="text-left font-medium px-6 py-3">RUT</th>
                <th className="text-left font-medium px-6 py-3">Cargo</th>
                <th className="text-right font-medium px-6 py-3">Sueldo base</th>
                <th className="text-right font-medium px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleados.map((emp) => (
                <tr key={emp.id} className="border-t border-slate-700 hover:bg-slate-700/30">
                  <td className="px-6 py-4 font-medium">{emp.nombre} {emp.apellido}</td>
                  <td className="px-6 py-4 text-slate-300">{emp.rut}</td>
                  <td className="px-6 py-4 text-slate-400">{emp.cargo ?? "—"}</td>
                  <td className="px-6 py-4 text-right">{formatearCLP(emp.sueldoBase)}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end">
                      <BotonEliminarEmpleado
                        empresaId={id}
                        empleadoId={emp.id}
                        nombre={`${emp.nombre} ${emp.apellido}`}
                      />
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
