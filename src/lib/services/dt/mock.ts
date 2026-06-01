// ─────────────────────────────────────────────────────────────
// IMPLEMENTACIÓN MOCK DEL SERVICIO DT (Inspección del Trabajo)
// Datos falsos pero realistas. Cumple el contrato ServicioDT.
// ─────────────────────────────────────────────────────────────

import type { ServicioDT, SituacionLaboral, MultaLaboral } from "./types";

// Mismos helpers que en el SII (semilla determinista + demora simulada)
function semillaDesdeRut(rut: string): number {
  let semilla = 0;
  for (const char of rut) semilla += char.charCodeAt(0);
  return semilla;
}

function numeroPseudoAleatorio(semilla: number, min: number, max: number): number {
  const x = Math.sin(semilla) * 10000;
  const fraccion = x - Math.floor(x);
  return Math.floor(fraccion * (max - min) + min);
}

function simularDemora(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Motivos típicos de multas de la Inspección del Trabajo en Chile
const MOTIVOS_MULTA = [
  "No pago de cotizaciones previsionales",
  "Incumplimiento de jornada laboral",
  "Falta de contrato de trabajo escrito",
  "No otorgar feriado legal",
  "Condiciones de higiene y seguridad",
];

export class ServicioDTMock implements ServicioDT {

  async obtenerSituacionLaboral(rut: string): Promise<SituacionLaboral> {
    await simularDemora(700);

    const semilla = semillaDesdeRut(rut);
    const trabajadores = numeroPseudoAleatorio(semilla, 1, 25);

    // Decidimos cuántas multas tiene (entre 0 y 3)
    const cantidadMultas = numeroPseudoAleatorio(semilla + 5, 0, 4);

    const multas: MultaLaboral[] = [];
    for (let i = 0; i < cantidadMultas; i++) {
      const semillaMulta = semilla + i * 13;
      const monto = numeroPseudoAleatorio(semillaMulta, 50000, 800000);
      // Alternamos estados según la semilla
      const estados: MultaLaboral["estado"][] = ["pendiente", "pagada", "apelada"];

      multas.push({
        id: `multa-${rut.slice(0, 4)}-${i + 1}`,
        fecha: new Date(2026, numeroPseudoAleatorio(semillaMulta, 0, 6), 15).toISOString(),
        motivo: MOTIVOS_MULTA[semillaMulta % MOTIVOS_MULTA.length],
        monto,
        estado: estados[semillaMulta % estados.length],
      });
    }

    // Calculamos cuántas y cuánto está pendiente
    const pendientes = multas.filter((m) => m.estado === "pendiente");
    const montoPendiente = pendientes.reduce((suma, m) => suma + m.monto, 0);

    return {
      rut,
      trabajadoresRegistrados: trabajadores,
      cotizacionesAlDia: pendientes.length === 0, // al día si no hay pendientes
      multasPendientes: pendientes.length,
      montoMultasPendientes: montoPendiente,
      multas,
    };
  }
}
