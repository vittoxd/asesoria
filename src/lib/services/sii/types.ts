// ─────────────────────────────────────────────────────────────
// CONTRATO DEL SERVICIO SII
// Aquí definimos QUÉ debe hacer un servicio del SII, no CÓMO.
// Tanto el mock (datos falsos) como el real (BaseAPI/Floid) deben
// cumplir este contrato. Así el resto de la app no sabe ni le importa
// cuál de los dos está usando.
// ─────────────────────────────────────────────────────────────

// Situación tributaria general de una empresa
export interface SituacionTributaria {
  rut: string;
  razonSocial: string;
  inicioActividades: boolean;     // ¿tiene inicio de actividades activo?
  regimen: string;                // "Pro Pyme Transparente", "General", etc.
  actividadEconomica: string;     // giro principal
  deudaFiscal: number;            // cuánto debe al SII en CLP
  alDia: boolean;                 // ¿está al día con sus obligaciones?
}

// Datos de una declaración F29 (IVA mensual)
export interface DatosF29 {
  periodo: string;          // "2026-05" (año-mes)
  ventasNetas: number;      // total de ventas sin IVA
  comprasNetas: number;     // total de compras sin IVA
  ivaDebito: number;        // IVA de las ventas (lo que cobró)
  ivaCredito: number;       // IVA de las compras (lo que pagó)
  ivaDeterminado: number;   // débito - crédito = lo que le toca pagar
  ppm: number;              // Pago Provisional Mensual
  totalAPagar: number;      // ivaDeterminado + ppm
  fechaVencimiento: string; // hasta cuándo tiene plazo (ISO date)
}

// ─────────────────────────────────────────────────────────────
// EL CONTRATO en sí: cualquier servicio SII DEBE tener estos métodos.
// Si el mock o el real no los implementan, TypeScript se queja.
// ─────────────────────────────────────────────────────────────
export interface ServicioSII {
  // Trae la situación tributaria general de una empresa
  obtenerSituacionTributaria(rut: string): Promise<SituacionTributaria>;

  // Trae el F29 de un período específico
  obtenerF29(rut: string, periodo: string): Promise<DatosF29>;

  // Trae los últimos N F29 (para gráficos e historial)
  obtenerHistorialF29(rut: string, cantidad: number): Promise<DatosF29[]>;
}
