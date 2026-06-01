// ─────────────────────────────────────────────────────────────
// FACTORY DEL SERVICIO SII
// Este archivo decide CUÁL implementación entregar: mock o real.
// El resto de la app importa SIEMPRE desde aquí, nunca directo
// del mock. Así, el día que tengamos BaseAPI/Floid, cambiamos
// solo este archivo y nada más en toda la app.
// ─────────────────────────────────────────────────────────────

import type { ServicioSII } from "./types";
import { ServicioSIIMock } from "./mock";

// Leemos un interruptor desde las variables de entorno.
// Si SII_MODE no está definido, usamos "mock" por defecto.
const MODO = process.env.SII_MODE ?? "mock";

// La factory: una sola función que devuelve el servicio correcto.
export function obtenerServicioSII(): ServicioSII {
  switch (MODO) {
    case "real":
      // 🚧 Cuando contratemos BaseAPI/Floid, aquí va:
      // return new ServicioSIIReal();
      throw new Error("El servicio SII real aún no está implementado. Usa SII_MODE=mock.");

    case "mock":
    default:
      return new ServicioSIIMock();
  }
}

// Re-exportamos los tipos para que la app los importe desde un solo lugar
export type { ServicioSII, SituacionTributaria, DatosF29 } from "./types";
