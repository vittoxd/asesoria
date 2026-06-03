"use server";

// ─────────────────────────────────────────────────────────────
// RECUPERAR CONTRASEÑA
// 1. solicitarReset: genera un token y (en producción) lo envía por
//    email. Aquí, como no hay servicio de correo, devolvemos el link
//    para mostrarlo en pantalla (modo demo).
// 2. restablecerConToken: valida el token y cambia la contraseña.
// ─────────────────────────────────────────────────────────────

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { randomBytes } from "crypto";

export type ResetState = { error?: string; link?: string };

export async function solicitarReset(_prev: ResetState, formData: FormData): Promise<ResetState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) return { error: "Ingresa tu correo." };

  const usuario = await prisma.usuario.findUnique({ where: { email } });

  // Por seguridad, NO revelamos si el email existe o no.
  // Solo generamos el token si existe.
  if (usuario) {
    const token = randomBytes(24).toString("hex");
    const expiraEn = new Date(Date.now() + 1000 * 60 * 30); // 30 minutos

    await prisma.passwordReset.create({
      data: { token, usuarioId: usuario.id, expiraEn },
    });

    // En producción: aquí se enviaría el email con este link.
    // Como no hay correo, lo devolvemos para mostrarlo (modo demo).
    return { link: `/recuperar/${token}` };
  }

  // Mensaje genérico (no revela si el correo existe)
  return { error: "Si el correo existe, generamos un enlace de recuperación." };
}

export type CambioState = { error?: string; ok?: boolean };

export async function restablecerConToken(
  token: string,
  _prev: CambioState,
  formData: FormData
): Promise<CambioState> {
  const password = String(formData.get("password") ?? "");
  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres." };
  }

  const reset = await prisma.passwordReset.findUnique({ where: { token } });
  if (!reset || reset.usado || reset.expiraEn < new Date()) {
    return { error: "El enlace no es válido o ya expiró." };
  }

  const passwordHash = await hashPassword(password);

  await prisma.$transaction([
    prisma.usuario.update({ where: { id: reset.usuarioId }, data: { passwordHash } }),
    prisma.passwordReset.update({ where: { id: reset.id }, data: { usado: true } }),
  ]);

  return { ok: true }; // éxito (el componente redirige al login)
}
