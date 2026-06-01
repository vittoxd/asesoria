// Seed — crea datos iniciales para desarrollo
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Crear estudio de prueba
  const estudio = await prisma.estudio.upsert({
    where: { rut: "76.000.000-0" },
    update: {},
    create: {
      nombre: "Estudio Contable Demo",
      rut: "76.000.000-0",
      telefono: "+56912345678",
    },
  });

  // Crear usuario ADMIN de prueba
  const passwordHash = await bcrypt.hash("demo1234", 12);

  await prisma.usuario.upsert({
    where: { email: "admin@demo.cl" },
    update: {},
    create: {
      email: "admin@demo.cl",
      passwordHash,
      nombre: "Admin",
      apellido: "Demo",
      rol: "ADMIN",
      activo: true,
      emailVerificado: true,
      estudioId: estudio.id,
    },
  });

  console.log("✅ Seed completado");
  console.log("   Email:      admin@demo.cl");
  console.log("   Contraseña: demo1234");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
