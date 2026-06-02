"use server";

// ─────────────────────────────────────────────────────────────
// GENERAR LIQUIDACIONES DE UN PERÍODO
// Toma todos los empleados activos de la empresa, calcula su
// liquidación con nuestra calculadora y la guarda en la BD.
// ─────────────────────────────────────────────────────────────

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { calcularLiquidacion } from "@/lib/calculadoraLiquidacion";
import { revalidatePath } from "next/cache";

export async function generarLiquidaciones(empresaId: string, periodo: string) {
  // 1. Verificar sesión y que la empresa sea del estudio
  const sesion = await auth();
  const estudioId = sesion?.user?.estudioId;
  if (!estudioId || sesion?.user?.rol === "CLIENTE") {
    throw new Error("No tienes permiso");
  }

  const empresa = await prisma.empresa.findFirst({
    where: { id: empresaId, estudioId },
  });
  if (!empresa) {
    throw new Error("Empresa no encontrada");
  }

  // 2. Traer los empleados activos de la empresa
  const empleados = await prisma.empleado.findMany({
    where: { empresaId, activo: true },
  });

  // 3. Por cada empleado, calcular y guardar su liquidación
  for (const empleado of empleados) {
    // Usamos NUESTRA calculadora
    const calculo = calcularLiquidacion({ sueldoBase: empleado.sueldoBase });

    // upsert = si ya existe la liquidación de ese empleado en ese
    // período, la actualiza; si no, la crea. Evita duplicados.
    await prisma.remuneracion.upsert({
      where: {
        empleadoId_periodo: { empleadoId: empleado.id, periodo },
      },
      update: {
        sueldoBase: empleado.sueldoBase,
        cotizacionAFP: calculo.cotizacionAFP,
        cotizacionSalud: calculo.cotizacionSalud,
        liquidoAPagar: calculo.liquidoAPagar,
      },
      create: {
        empresaId,
        empleadoId: empleado.id,
        periodo,
        sueldoBase: empleado.sueldoBase,
        cotizacionAFP: calculo.cotizacionAFP,
        cotizacionSalud: calculo.cotizacionSalud,
        liquidoAPagar: calculo.liquidoAPagar,
      },
    });
  }

  // 4. Registrar en el AuditLog
  await prisma.auditLog.create({
    data: {
      usuarioId: sesion.user.id,
      tipo: "GENERAR_LIQUIDACIONES",
      descripcion: `Generó liquidaciones del período ${periodo} (${empleados.length} empleados)`,
      recursoId: empresaId,
      recursoTipo: "remuneracion",
    },
  });

  revalidatePath(`/dashboard/empresas/${empresaId}/remuneraciones`);
}
