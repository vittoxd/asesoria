"use server";

// ─────────────────────────────────────────────────────────────
// SERVER ACTIONS DE EMPLEADOS
// Los empleados pertenecen a una empresa. Antes de tocar nada,
// verificamos que esa empresa sea del estudio del usuario.
// ─────────────────────────────────────────────────────────────

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Guardia: verifica sesión, permiso y que la empresa sea del estudio
async function verificarEmpresa(empresaId: string) {
  const sesion = await auth();
  const estudioId = sesion?.user?.estudioId;

  if (!sesion?.user || sesion.user.rol === "CLIENTE") {
    throw new Error("No tienes permiso");
  }
  if (!estudioId) {
    throw new Error("Tu usuario no está asociado a un estudio");
  }

  const empresa = await prisma.empresa.findFirst({
    where: { id: empresaId, estudioId },
  });
  if (!empresa) {
    throw new Error("Empresa no encontrada o no tienes acceso");
  }

  return { usuarioId: sesion.user.id, empresa };
}

// ── Crear empleado ──
export async function crearEmpleado(empresaId: string, formData: FormData) {
  const { usuarioId } = await verificarEmpresa(empresaId);

  const rut = String(formData.get("rut") ?? "").trim();
  const nombre = String(formData.get("nombre") ?? "").trim();
  const apellido = String(formData.get("apellido") ?? "").trim();
  const cargo = String(formData.get("cargo") ?? "").trim();
  const sueldoBase = Number(formData.get("sueldoBase") ?? 0);
  const fechaIngreso = String(formData.get("fechaIngreso") ?? "").trim();

  // Validación
  if (!rut || !nombre || !apellido || !sueldoBase || !fechaIngreso) {
    throw new Error("Faltan datos obligatorios");
  }

  // No permitir RUT repetido en la misma empresa
  const existe = await prisma.empleado.findFirst({
    where: { empresaId, rut },
  });
  if (existe) {
    throw new Error("Ya existe un empleado con ese RUT en esta empresa");
  }

  await prisma.empleado.create({
    data: {
      empresaId,
      rut,
      nombre,
      apellido,
      cargo: cargo || null,
      sueldoBase,
      fechaIngreso: new Date(fechaIngreso),
    },
  });

  await prisma.auditLog.create({
    data: {
      usuarioId,
      tipo: "CREAR_EMPLEADO",
      descripcion: `Agregó al empleado ${nombre} ${apellido} (${rut})`,
      recursoId: empresaId,
      recursoTipo: "empleado",
    },
  });

  revalidatePath(`/dashboard/empresas/${empresaId}/empleados`);
}

// ── Eliminar empleado ──
export async function eliminarEmpleado(empresaId: string, empleadoId: string) {
  const { usuarioId } = await verificarEmpresa(empresaId);

  // Verificar que el empleado sea de esta empresa
  const empleado = await prisma.empleado.findFirst({
    where: { id: empleadoId, empresaId },
  });
  if (!empleado) {
    throw new Error("Empleado no encontrado");
  }

  await prisma.empleado.delete({ where: { id: empleadoId } });

  await prisma.auditLog.create({
    data: {
      usuarioId,
      tipo: "ELIMINAR_EMPLEADO",
      descripcion: `Eliminó al empleado ${empleado.nombre} ${empleado.apellido}`,
      recursoId: empresaId,
      recursoTipo: "empleado",
    },
  });

  revalidatePath(`/dashboard/empresas/${empresaId}/empleados`);
}
