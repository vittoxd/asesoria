// Extendemos los tipos de NextAuth para incluir nuestros campos personalizados
// Así podemos usar session.user.rol sin "as any"

import { DefaultSession } from "next-auth";

type Rol = "SUPERADMIN" | "ADMIN" | "CONTADOR" | "CLIENTE";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      rol: Rol;
      estudioId: string | null;
      estudioNombre: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    rol: Rol;
    estudioId: string | null;
    estudioNombre: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    rol: Rol;
    estudioId: string | null;
    estudioNombre: string | null;
  }
}
