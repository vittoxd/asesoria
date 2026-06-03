// ─────────────────────────────────────────────────────────────
// SEED — resetea la base y crea un demo limpio y ordenado.
// Ejecutar con: npx tsx prisma/seed.ts
// ─────────────────────────────────────────────────────────────

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 1. Limpiar todo (en orden, primero las tablas hijas)
  await prisma.passwordReset.deleteMany();
  await prisma.remuneracion.deleteMany();
  await prisma.empleado.deleteMany();
  await prisma.documento.deleteMany();
  await prisma.declaracionF29.deleteMany();
  await prisma.declaracionF22.deleteMany();
  await prisma.alerta.deleteMany();
  await prisma.usuarioEmpresa.deleteMany();
  await prisma.sesion.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.pago.deleteMany();
  await prisma.suscripcion.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.empresa.deleteMany();
  await prisma.estudio.deleteMany();

  console.log("🧹 Base de datos limpia");

  // 2. Crear estudio demo + admin
  const passwordHash = await bcrypt.hash("demo1234", 12);

  const estudio = await prisma.estudio.create({
    data: {
      nombre: "Estudio Contable Demo",
      rut: "76.000.000-0",
      telefono: "+56912345678",
      usuarios: {
        create: {
          email: "admin@demo.cl",
          passwordHash,
          nombre: "Admin",
          apellido: "Demo",
          rol: "ADMIN",
          emailVerificado: true,
        },
      },
    },
  });

  // 3. Un par de empresas de ejemplo
  await prisma.empresa.createMany({
    data: [
      { estudioId: estudio.id, rut: "78.555.444-2", razonSocial: "Transportes del Sur SpA", giro: "Transporte de carga", comuna: "Graneros" },
      { estudioId: estudio.id, rut: "76.123.456-7", razonSocial: "Comercializadora Andes Ltda", giro: "Venta al por menor", comuna: "Rancagua" },
    ],
  });

  console.log("✅ Seed completado");
  console.log("   Estudio:    Estudio Contable Demo");
  console.log("   Login:      admin@demo.cl / demo1234");
  console.log("   Empresas:   2 de ejemplo");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
