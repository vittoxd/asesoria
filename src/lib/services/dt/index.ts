// ─────────────────────────────────────────────────────────────
// FACTORY DEL SERVICIO DT (Inspección del Trabajo)
// Decide entre mock y real. La app importa siempre desde aquí.
// ─────────────────────────────────────────────────────────────

import type { ServicioDT } from "./types";
import { ServicioDTMock } from "./mock";

const MODO = process.env.DT_MODE ?? "mock";

export function obtenerServicioDT(): ServicioDT {
  switch (MODO) {
    case "real":
      // 🚧 Cuando integremos la API real de la DT:
      // return new ServicioDTReal();
      throw new Error("El servicio DT real aún no está implementado. Usa DT_MODE=mock.");

    case "mock":
    default:
      return new ServicioDTMock();
  }
}

export type { ServicioDT, SituacionLaboral, MultaLaboral } from "./types";
