"use client";

// ─────────────────────────────────────────────────────────────
// TOAST NOTIFIER (Client Component)
// Las server actions redirigen con ?ok=creada (o actualizada/eliminada).
// Este componente lee ese parámetro de la URL y muestra el toast,
// luego limpia el parámetro para que no se repita al recargar.
// ─────────────────────────────────────────────────────────────

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

const MENSAJES: Record<string, string> = {
  creada: "Empresa creada correctamente",
  actualizada: "Cambios guardados",
  eliminada: "Empresa eliminada",
};

export function ToastNotifier() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const ok = params.get("ok");

  useEffect(() => {
    if (ok && MENSAJES[ok]) {
      toast.success(MENSAJES[ok]);
      router.replace(pathname); // limpia el ?ok= de la URL
    }
  }, [ok, pathname, router]);

  return null;
}
