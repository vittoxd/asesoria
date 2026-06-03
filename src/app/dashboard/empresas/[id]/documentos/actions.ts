"use server";

// ─────────────────────────────────────────────────────────────
// DOCUMENTOS de una empresa (facturas, boletas, notas de crédito)
// Calcula IVA (19%) y total automáticamente desde el monto neto.
// ─────────────────────────────────────────────────────────────

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { empresaAccesible } from "@/lib/accesoEmpresas";
import { revalidatePath } from "next/cache";

async function verificar(empresaId: string) {
  const sesion = await auth();
  if (!sesion?.user || sesion.user.rol === "CLIENTE") {
    throw new Error("No tienes permiso");
  }
  const empresa = await empresaAccesible(sesion.user, empresaId);
  if (!empresa) throw new Error("Empresa no encontrada o sin acceso");
  return { usuarioId: sesion.user.id };
}

export async function crearDocumento(empresaId: string, formData: FormData) {
  const { usuarioId } = await verificar(empresaId);

  const tipo = String(formData.get("tipo") ?? "factura");
  const folio = Number(formData.get("folio") ?? 0);
  const rutReceptor = String(formData.get("rutReceptor") ?? "").trim();
  const fecha = String(formData.get("fecha") ?? "").trim();
  const montoNeto = Number(formData.get("montoNeto") ?? 0);

  if (!fecha || !montoNeto) {
    throw new Error("La fecha y el monto neto son obligatorios");
  }

  // El IVA y el total se calculan solos (19%)
  const iva = Math.round(montoNeto * 0.19);
  const montoTotal = montoNeto + iva;

  await prisma.documento.create({
    data: {
      empresaId,
      tipo,
      folio: folio || null,
      rutReceptor: rutReceptor || null,
      fecha: new Date(fecha),
      montoNeto,
      iva,
      montoTotal,
    },
  });

  await prisma.auditLog.create({
    data: {
      usuarioId,
      tipo: "CREAR_DOCUMENTO",
      descripcion: `Registró un ${tipo} por ${montoTotal}`,
      recursoId: empresaId,
      recursoTipo: "documento",
    },
  });

  revalidatePath(`/dashboard/empresas/${empresaId}/documentos`);
}

export async function eliminarDocumento(empresaId: string, documentoId: string) {
  const { usuarioId } = await verificar(empresaId);

  const doc = await prisma.documento.findFirst({
    where: { id: documentoId, empresaId },
  });
  if (!doc) throw new Error("Documento no encontrado");

  await prisma.documento.delete({ where: { id: documentoId } });

  await prisma.auditLog.create({
    data: {
      usuarioId,
      tipo: "ELIMINAR_DOCUMENTO",
      descripcion: `Eliminó un ${doc.tipo}`,
      recursoId: empresaId,
      recursoTipo: "documento",
    },
  });

  revalidatePath(`/dashboard/empresas/${empresaId}/documentos`);
}
