// ─────────────────────────────────────────────────────────────
// ACCESO A EMPRESAS SEGÚN EL ROL (corazón de la seguridad multi-tenant)
// Una sola fuente de verdad para decidir qué empresas ve cada usuario:
//   ADMIN / SUPERADMIN → todas las del estudio
//   CONTADOR           → solo las que le asignaron (UsuarioEmpresa)
//   CLIENTE            → solo su propia empresa (empresaClienteId)
// ─────────────────────────────────────────────────────────────

import { prisma } from "@/lib/prisma";

type UsuarioSesion = {
  id: string;
  rol: string;
  estudioId: string | null;
};

// Lista de empresas que el usuario PUEDE ver
export async function empresasVisibles(user: UsuarioSesion) {
  if (!user.estudioId) return [];

  if (user.rol === "ADMIN" || user.rol === "SUPERADMIN") {
    return prisma.empresa.findMany({
      where: { estudioId: user.estudioId },
      orderBy: { creadoEn: "desc" },
    });
  }

  if (user.rol === "CONTADOR") {
    // Solo las empresas que tienen una asignación con este usuario
    return prisma.empresa.findMany({
      where: {
        estudioId: user.estudioId,
        contadoresAsignados: { some: { usuarioId: user.id } },
      },
      orderBy: { creadoEn: "desc" },
    });
  }

  if (user.rol === "CLIENTE") {
    const usuario = await prisma.usuario.findUnique({
      where: { id: user.id },
      select: { empresaClienteId: true },
    });
    if (!usuario?.empresaClienteId) return [];
    return prisma.empresa.findMany({ where: { id: usuario.empresaClienteId } });
  }

  return [];
}

// Verifica acceso a UNA empresa específica. Devuelve la empresa o null.
// Esto es lo que evita que alguien acceda a una empresa ajena por la URL.
export async function empresaAccesible(user: UsuarioSesion, empresaId: string) {
  if (!user.estudioId) return null;

  if (user.rol === "ADMIN" || user.rol === "SUPERADMIN") {
    return prisma.empresa.findFirst({
      where: { id: empresaId, estudioId: user.estudioId },
    });
  }

  if (user.rol === "CONTADOR") {
    return prisma.empresa.findFirst({
      where: {
        id: empresaId,
        estudioId: user.estudioId,
        contadoresAsignados: { some: { usuarioId: user.id } },
      },
    });
  }

  if (user.rol === "CLIENTE") {
    const usuario = await prisma.usuario.findUnique({
      where: { id: user.id },
      select: { empresaClienteId: true },
    });
    if (!usuario?.empresaClienteId || usuario.empresaClienteId !== empresaId) {
      return null;
    }
    return prisma.empresa.findFirst({ where: { id: empresaId } });
  }

  return null;
}
