"use server";

// ─────────────────────────────────────────────────────────────
// REGISTRO DE UN NUEVO ESTUDIO + SU ADMIN
// Cuando alguien se registra, creamos dos cosas conectadas:
//  1. El Estudio (su empresa contable)
//  2. El Usuario como ADMIN de ese estudio
// ─────────────────────────────────────────────────────────────

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function registrarEstudio(formData: FormData) {
  // 1. Leer los datos del formulario
  const estudioNombre = String(formData.get("estudioNombre") ?? "").trim();
  const nombre = String(formData.get("nombre") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  // 2. Validar
  if (!estudioNombre || !nombre || !email || !password) {
    throw new Error("Todos los campos son obligatorios.");
  }
  if (password.length < 6) {
    throw new Error("La contraseña debe tener al menos 6 caracteres.");
  }

  // 3. Verificar que el email no esté ya registrado
  const existe = await prisma.usuario.findUnique({ where: { email } });
  if (existe) {
    throw new Error("Ya existe una cuenta con ese correo.");
  }

  // 4. Hashear la contraseña (NUNCA se guarda en texto plano)
  const passwordHash = await hashPassword(password);

  // 5. Crear el estudio Y el usuario en una sola operación (escritura anidada)
  await prisma.estudio.create({
    data: {
      nombre: estudioNombre,
      usuarios: {
        create: {
          nombre,
          email,
          passwordHash,
          rol: "ADMIN", // el que se registra es el admin de su estudio
          emailVerificado: true,
        },
      },
    },
  });
}
