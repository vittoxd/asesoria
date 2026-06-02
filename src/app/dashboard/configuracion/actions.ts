"use server";

// Configuración del estudio (solo ADMIN puede editar)
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function actualizarEstudio(formData: FormData) {
  const sesion = await auth();
  const rol = sesion?.user?.rol;
  const estudioId = sesion?.user?.estudioId;

  if (!sesion?.user || (rol !== "ADMIN" && rol !== "SUPERADMIN")) {
    throw new Error("Solo un administrador puede editar el estudio");
  }
  if (!estudioId) {
    throw new Error("Tu usuario no está asociado a un estudio");
  }

  const nombre = String(formData.get("nombre") ?? "").trim();
  const rut = String(formData.get("rut") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim();
  const direccion = String(formData.get("direccion") ?? "").trim();

  if (!nombre) {
    throw new Error("El nombre del estudio es obligatorio");
  }

  await prisma.estudio.update({
    where: { id: estudioId },
    data: {
      nombre,
      rut: rut || null,
      telefono: telefono || null,
      direccion: direccion || null,
    },
  });

  await prisma.auditLog.create({
    data: {
      usuarioId: sesion.user.id,
      tipo: "ACTUALIZAR_ESTUDIO",
      descripcion: `Actualizó los datos del estudio`,
      recursoId: estudioId,
      recursoTipo: "estudio",
    },
  });

  revalidatePath("/dashboard/configuracion");
}
