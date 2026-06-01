// Configuración central de NextAuth v5
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verificarPassword } from "@/lib/auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },

  pages: {
    signIn: "/login",
  },

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },

      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Obtener IP para el AuditLog
        const ip = (req as any)?.headers?.["x-forwarded-for"] ?? "desconocida";

        // Buscar usuario
        const usuario = await prisma.usuario.findUnique({
          where: { email },
          include: { estudio: true },
        });

        // Usuario no existe — registrar intento fallido
        if (!usuario) {
          await registrarAudit(null, "LOGIN", `Intento de login fallido: email no encontrado (${email})`, ip, false);
          return null;
        }

        // Cuenta desactivada — mensaje específico
        if (!usuario.activo) {
          await registrarAudit(usuario.id, "LOGIN", "Login bloqueado: cuenta desactivada", ip, false);
          // Lanzamos un error con código especial para mostrarlo en el frontend
          throw new Error("CUENTA_INACTIVA");
        }

        // Verificar contraseña
        const passwordValida = await verificarPassword(password, usuario.passwordHash);

        if (!passwordValida) {
          await registrarAudit(usuario.id, "LOGIN", "Login fallido: contraseña incorrecta", ip, false);
          return null;
        }

        // ✅ Login exitoso
        await Promise.all([
          // Actualizar último login
          prisma.usuario.update({
            where: { id: usuario.id },
            data: { ultimoLoginEn: new Date() },
          }),
          // Registrar en AuditLog
          registrarAudit(usuario.id, "LOGIN", `Login exitoso desde ${ip}`, ip, true),
        ]);

        return {
          id: usuario.id,
          email: usuario.email,
          name: `${usuario.nombre} ${usuario.apellido ?? ""}`.trim(),
          rol: usuario.rol as any,
          estudioId: usuario.estudioId,
          estudioNombre: usuario.estudio?.nombre ?? null,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.rol = user.rol;
        token.estudioId = user.estudioId;
        token.estudioNombre = user.estudioNombre;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.rol = token.rol as any;
        session.user.estudioId = (token.estudioId as string) ?? null;
        session.user.estudioNombre = (token.estudioNombre as string) ?? null;
      }
      return session;
    },
  },
});

// Helper para registrar eventos en AuditLog
async function registrarAudit(
  usuarioId: string | null,
  tipo: string,
  descripcion: string,
  ip: string,
  exitoso: boolean
) {
  try {
    await prisma.auditLog.create({
      data: {
        usuarioId,
        tipo,
        descripcion,
        ipAddress: String(ip),
        exitoso,
      },
    });
  } catch {
    // No romper el login si falla el log
  }
}
