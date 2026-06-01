// ─────────────────────────────────────────────────────────────
// HELPERS DE FORMATO
// Funciones chicas y reutilizables para mostrar datos bonitos.
// ─────────────────────────────────────────────────────────────

// Convierte un número a pesos chilenos: 1144534 → "$1.144.534"
export function formatearCLP(monto: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(monto);
}

// Convierte un período "2026-05" a algo legible: "Mayo 2026"
export function formatearPeriodo(periodo: string): string {
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];
  const [anio, mes] = periodo.split("-").map(Number);
  return `${meses[mes - 1]} ${anio}`;
}

// Convierte una fecha ISO a formato chileno: "2026-06-12" → "12/06/2026"
export function formatearFecha(isoString: string): string {
  return new Date(isoString).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
