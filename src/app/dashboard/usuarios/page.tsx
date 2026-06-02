// Gestión de usuarios del estudio (solo ADMIN)
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { crearUsuario, toggleUsuarioActivo, toggleAsignacionEmpresa } from "./actions";
import { BotonResetPassword } from "./BotonResetPassword";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserPlus, Building2 } from "lucide-react";

export default async function UsuariosPage() {
  const sesion = await auth();
  const estudioId = sesion?.user?.estudioId;
  const miId = sesion?.user?.id;

  // Usuarios del estudio (con sus empresas asignadas)
  const usuarios = estudioId
    ? await prisma.usuario.findMany({
        where: { estudioId },
        include: { empresasAsignadas: true },
        orderBy: { creadoEn: "asc" },
      })
    : [];

  // Empresas del estudio (para asignar a contadores)
  const empresas = estudioId
    ? await prisma.empresa.findMany({ where: { estudioId }, orderBy: { razonSocial: "asc" } })
    : [];

  return (
    <main className="max-w-5xl mx-auto px-8 py-10">
      <h1 className="text-2xl font-bold mb-1">Usuarios del estudio</h1>
      <p className="text-slate-500 text-sm mb-6">Crea contadores y clientes, y asígnales empresas.</p>

      {/* Formulario para crear usuario */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 mb-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase mb-4">
          <UserPlus size={16} /> Nuevo usuario
        </h2>
        <form action={crearUsuario} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nombre" className="text-slate-300">Nombre <span className="text-red-400">*</span></Label>
            <Input id="nombre" name="nombre" required className="bg-slate-700 border-slate-600 text-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apellido" className="text-slate-300">Apellido</Label>
            <Input id="apellido" name="apellido" className="bg-slate-700 border-slate-600 text-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300">Email <span className="text-red-400">*</span></Label>
            <Input id="email" name="email" type="email" required className="bg-slate-700 border-slate-600 text-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-300">Contraseña <span className="text-red-400">*</span></Label>
            <Input id="password" name="password" type="password" required minLength={6} className="bg-slate-700 border-slate-600 text-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rol" className="text-slate-300">Rol</Label>
            <select id="rol" name="rol" className="block w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 text-sm">
              <option value="CONTADOR">Contador (ve empresas asignadas)</option>
              <option value="CLIENTE">Cliente (ve su empresa)</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="empresaClienteId" className="text-slate-300">Empresa <span className="text-slate-500">(solo para clientes)</span></Label>
            <select id="empresaClienteId" name="empresaClienteId" className="block w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 text-sm">
              <option value="">— Ninguna —</option>
              {empresas.map((e) => (
                <option key={e.id} value={e.id}>{e.razonSocial}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold">
              Crear usuario
            </Button>
          </div>
        </form>
      </div>

      {/* Lista de usuarios */}
      <div className="space-y-4">
        {usuarios.map((u) => {
          const idsAsignadas = new Set(u.empresasAsignadas.map((a) => a.empresaId));
          return (
            <div key={u.id} className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">
                    {u.nombre} {u.apellido ?? ""}
                    {u.id === miId && <span className="text-slate-500 text-xs"> (tú)</span>}
                  </p>
                  <p className="text-slate-500 text-sm">{u.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium px-2.5 py-1">
                      {u.rol}
                    </span>
                    {u.activo ? (
                      <span className="inline-flex rounded-full bg-green-500/10 text-green-400 text-xs font-medium px-2.5 py-1">Activo</span>
                    ) : (
                      <span className="inline-flex rounded-full bg-red-500/10 text-red-400 text-xs font-medium px-2.5 py-1">Inactivo</span>
                    )}
                  </div>
                </div>

                {/* Acciones (no sobre sí mismo, no sobre otros admin) */}
                {u.id !== miId && u.rol !== "ADMIN" && (
                  <div className="flex items-center gap-4">
                    <BotonResetPassword usuarioId={u.id} email={u.email} />
                    <form action={toggleUsuarioActivo.bind(null, u.id)}>
                      <button type="submit" className="text-slate-400 hover:text-white text-sm">
                        {u.activo ? "Desactivar" : "Activar"}
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* Asignación de empresas (solo para CONTADOR) */}
              {u.rol === "CONTADOR" && (
                <div className="mt-4 border-t border-slate-700 pt-4">
                  <p className="flex items-center gap-1.5 text-slate-400 text-xs uppercase font-semibold mb-3">
                    <Building2 size={13} /> Empresas asignadas
                  </p>
                  {empresas.length === 0 ? (
                    <p className="text-slate-500 text-sm">No hay empresas en el estudio todavía.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {empresas.map((emp) => {
                        const asignada = idsAsignadas.has(emp.id);
                        return (
                          <form key={emp.id} action={toggleAsignacionEmpresa.bind(null, u.id, emp.id)}>
                            <button
                              type="submit"
                              className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                                asignada
                                  ? "bg-blue-600 border-blue-500 text-white"
                                  : "bg-slate-700/40 border-slate-600 text-slate-400 hover:text-white"
                              }`}
                            >
                              {asignada ? "✓ " : "+ "}{emp.razonSocial}
                            </button>
                          </form>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
