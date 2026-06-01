"use client";

// ─────────────────────────────────────────────────────────────
// BOTÓN ELIMINAR (Client Component)
// Necesita "use client" porque usa interactividad del navegador:
// mostrar un confirm() antes de borrar. Los Server Components no
// pueden hacer esto (no corren en el navegador).
// ─────────────────────────────────────────────────────────────

import { eliminarEmpresa } from "./actions";

export function BotonEliminar({
  id,
  nombre,
}: {
  id: string;
  nombre: string;
}) {
  return (
    <form
      action={eliminarEmpresa.bind(null, id)}
      onSubmit={(e) => {
        // Si el usuario cancela el confirm, frenamos el envío
        const confirmado = window.confirm(
          `¿Seguro que quieres eliminar "${nombre}"? Esta acción no se puede deshacer.`
        );
        if (!confirmado) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className="text-red-400 hover:text-red-300">
        Eliminar
      </button>
    </form>
  );
}
