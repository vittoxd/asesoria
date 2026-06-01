"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireEstudio() {
  const sesion = await auth();

  if (!sesion?.user) {
    throw new Error("No autenticado");
  }
  const { rol, estudioId } = sesion.user;

  if (rol === "CLIENTE") {
    throw new Error("No tienes permisos para gestionar empresas");
  }

  if (!estudioId) {
    throw new Error("Tu usuario no esta asociado a un estudio");
  }

  return { usuarioId: sesion.user.id, estudioId };
}

export async function crearEmpresa(formData: FormData) {
  const { usuarioId, estudioId } = await requireEstudio();

  const rut = String(formData.get("rut") ?? "").trim();
  const razonSocial = String(formData.get("razonSocial") ?? "").trim();
  const giro = String(formData.get("giro") ?? "").trim();
  const comuna = String(formData.get("comuna") ?? "").trim();

  if (!rut || !razonSocial) {
    throw new Error("el RUT y la razon social son obligatorias");
  }

  const existe = await prisma.empresa.findUnique({ where: { rut } });
  if (existe) {
    throw new Error("Ya existe una empresa con ese RUT");
  }

  await prisma.empresa.create({
    data: {
      rut,
      razonSocial,
      giro: giro || null,
      comuna: comuna || null,
      estudioId,
    },
  });

  await prisma.auditLog.create({
    data: {
      usuarioId,
      tipo: "CREAR_EMPRESA",
      descripcion: `Creó la empresa ${razonSocial} (${rut})`,
      recursoTipo: "empresa",
    },
  });

  revalidatePath("/dashboard/empresas");
  redirect("/dashboard/empresas?ok=creada");
}

export async function actualizarEmpresa(id: string, formData: FormData) {
  const { usuarioId, estudioId } = await requireEstudio();

  const empresa = await prisma.empresa.findFirst({
    where: { id, estudioId },
  });

  if (!empresa) {
    throw new Error("Empresa no encontrada o no tienes acceso a ella");
  }

  const razonSocial = String(formData.get("razonSocial") ?? "").trim();
  const giro = String(formData.get("giro") ?? "").trim();
  const comuna = String(formData.get("comuna") ?? "").trim();

  if (!razonSocial) {
    throw new Error("La razon social es obligatoria");
  }

  await prisma.empresa.update({
    where: { id },
    data: {
      razonSocial,
      giro: giro || null,
      comuna: comuna || null,
    },
  });

  await prisma.auditLog.create({
    data: {
      usuarioId,
      tipo: "ACTUALIZAR_EMPRESA",
      descripcion: `Actualizó la empresa ${razonSocial}`,
      recursoId: id,
      recursoTipo: "empresa",
    },
  });

  revalidatePath("/dashboard/empresas");
  redirect("/dashboard/empresas?ok=actualizada");
}

export async function eliminarEmpresa(id: string) {
  const { usuarioId, estudioId } = await requireEstudio();

  const empresa = await prisma.empresa.findFirst({
    where: { id, estudioId },
  });

  if (!empresa) {
    throw new Error("Empresa no encontrada o no tienes acceso a ella");
  }

  await prisma.empresa.delete({
    where: { id },
  });

  await prisma.auditLog.create({
    data: {
      usuarioId,
      tipo: "ELIMINAR_EMPRESA",
      descripcion: `Eliminó la empresa ${empresa.razonSocial} (${empresa.rut})`,
      recursoId: id,
      recursoTipo: "empresa",
    },
  });

  revalidatePath("/dashboard/empresas");
  redirect("/dashboard/empresas?ok=eliminada");
}
