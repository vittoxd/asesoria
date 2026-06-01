// ─────────────────────────────────────────────────────────────
// CONTRATO DEL SERVICIO DT (Dirección del Trabajo / Inspección)
// Mismo patrón que el SII: definimos QUÉ debe hacer, no CÓMO.
// ─────────────────────────────────────────────────────────────

// Una multa laboral individual
export interface MultaLaboral {
  id: string;
  fecha: string;                                  // ISO date
  motivo: string;                                 // razón de la multa
  monto: number;                                  // en CLP
  estado: "pendiente" | "pagada" | "apelada";
}

// Situación laboral general de una empresa
export interface SituacionLaboral {
  rut: string;
  trabajadoresRegistrados: number;   // cuántos empleados tiene
  cotizacionesAlDia: boolean;        // ¿pagó AFP/salud al día?
  multasPendientes: number;          // cantidad de multas sin pagar
  montoMultasPendientes: number;     // suma en CLP de lo que debe
  multas: MultaLaboral[];            // detalle de todas las multas
}

// ─────────────────────────────────────────────────────────────
// EL CONTRATO: cualquier servicio DT debe poder entregar esto.
// ─────────────────────────────────────────────────────────────
export interface ServicioDT {
  obtenerSituacionLaboral(rut: string): Promise<SituacionLaboral>;
}
