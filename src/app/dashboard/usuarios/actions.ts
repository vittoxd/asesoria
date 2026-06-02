"use server";

// ─────────────────────────────────────────────────────────────
// GESTIÓN DE USUARIOS DEL ESTUDIO
// Solo un ADMIN puede crear usuarios (CONTADOR/CLIENTE) y asignarles
// empresas. Todo queda acotado al estudio del admin (multi-tenant).
// ─────────────────────────────────────────────────────────────

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Guardia: solo ADMIN o SUPERADMIN, y devuelve su estudioId
async function requireAdmin() {
  const sesion = await auth();
  const rol = sesion?.user?.rol;
  const estudioId = sesion?.user?.estudioId;

  if (!sesion?.user || (rol !== "ADMIN" && rol !== "SUPERADMIN")) {
    throw new Error("Solo un administrador puede gestionar usuarios");
  }
  if (!estudioId) {
    throw new Error("Tu usuario no está asociado a un estudio");
  }
  return { usuarioId: sesion.user.id, estudioId };
}

// ── Crear un usuario del estudio (CONTADOR o CLIENTE) ──
export async function crearUsuario(formData: FormData) {
  const { usuarioId, estudioId } = await requireAdmin();

  const nombre = String(formData.get("nombre") ?? "").trim();
  const apellido = String(formData.get("apellido") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const rol = String(formData.get("rol") ?? "CONTADOR");
  const empresaClienteId = String(formData.get("empresaClienteId") ?? "").trim();

  if (!nombre || !email || !password) {
    throw new Error("Nombre, email y contraseña son obligatorios");
  }
  if (password.length < 6) {
    throw new Error("La contraseña debe tener al menos 6 caracteres");
  }
  if (rol !== "CONTADOR" && rol !== "CLIENTE") {
    throw new Error("Rol inválido");
  }
  // Un CLIENTE debe estar ligado a una empresa de SU estudio
  if (rol === "CLIENTE") {
    if (!empresaClienteId) {
      throw new Error("Debes elegir la empresa del cliente");
    }
    const empresa = await prisma.empresa.findFirst({
      where: { id: empresaClienteId, estudioId },
    });
    if (!empresa) {
      throw new Error("Empresa no válida");
    }
  }

  const existe = await prisma.usuario.findUnique({ where: { email } });
  if (existe) {
    throw new Error("Ya existe una cuenta con ese correo");
  }

  const passwordHash = await hashPassword(password);

  await prisma.usuario.create({
    data: {
      nombre,
      apellido: apellido || null,
      email,
      passwordHash,
      rol,
      emailVerificado: true,
      estudioId, // queda en el mismo estudio del admin
      empresaClienteId: rol === "CLIENTE" ? empresaClienteId : null,
    },
  });

  await prisma.auditLog.create({
    data: {
      usuarioId,
      tipo: "CREAR_USUARIO",
      descripcion: `Creó al usuario ${nombre} (${email}) con rol ${rol}`,
      recursoTipo: "usuario",
    },
  });

  revalidatePath("/dashboard/usuarios");
}

// ── Activar/desactivar un usuario ──
export async function toggleUsuarioActivo(usuarioObjetivoId: string) {
  const { usuarioId, estudioId } = await requireAdmin();

  // Verificar que el usuario objetivo sea del mismo estudio
  const objetivo = await prisma.usuario.findFirst({
    where: { id: usuarioObjetivoId, estudioId },
  });
  if (!objetivo) {
    throw new Error("Usuario no encontrado");
  }
  // No permitir desactivarse a sí mismo
  if (objetivo.id === usuarioId) {
    throw new Error("No puedes desactivar tu propia cuenta");
  }

  await prisma.usuario.update({
    where: { id: usuarioObjetivoId },
    data: { activo: !objetivo.activo },
  });

  revalidatePath("/dashboard/usuarios");
}

// ── Restablecer la contraseña de un usuario (lo hace el admin) ──
export async function restablecerPassword(usuarioObjetivoId: string, formData: FormData) {
  const { usuarioId, estudioId } = await requireAdmin();

  const objetivo = await prisma.usuario.findFirst({
    where: { id: usuarioObjetivoId, estudioId },
  });
  if (!objetivo) {
    throw new Error("Usuario no encontrado");
  }

  const nueva = String(formData.get("password") ?? "");
  if (nueva.length < 6) {
    throw new Error("La contraseña debe tener al menos 6 caracteres");
  }

  const passwordHash = await hashPassword(nueva);
  await prisma.usuario.update({
    where: { id: usuarioObjetivoId },
    data: { passwordHash },
  });

  await prisma.auditLog.create({
    data: {
      usuarioId,
      tipo: "RESET_PASSWORD",
      descripcion: `Restableció la contraseña de ${objetivo.email}`,
      recursoId: usuarioObjetivoId,
      recursoTipo: "usuario",
    },
  });

  revalidatePath("/dashboard/usuarios");
}

// ── Asignar / quitar una empresa a un contador ──
export async function toggleAsignacionEmpresa(
  usuarioObjetivoId: string,
  empresaId: string
) {
  const { usuarioId, estudioId } = await requireAdmin();

  // Verificar que tanto el usuario como la empresa sean del estudio
  const [objetivo, empresa] = await Promise.all([
    prisma.usuario.findFirst({ where: { id: usuarioObjetivoId, estudioId } }),
    prisma.empresa.findFirst({ where: { id: empresaId, estudioId } }),
  ]);
  if (!objetivo || !empresa) {
    throw new Error("Usuario o empresa no encontrados");
  }

  // ¿Ya está asignada?
  const asignacion = await prisma.usuarioEmpresa.findUnique({
    where: { usuarioId_empresaId: { usuarioId: usuarioObjetivoId, empresaId } },
  });

  if (asignacion) {
    // Si existe, la quitamos
    await prisma.usuarioEmpresa.delete({
      where: { usuarioId_empresaId: { usuarioId: usuarioObjetivoId, empresaId } },
    });
  } else {
    // Si no existe, la creamos
    await prisma.usuarioEmpresa.create({
      data: { usuarioId: usuarioObjetivoId, empresaId, asignadoPor: usuarioId },
    });
  }

  revalidatePath("/dashboard/usuarios");
}
