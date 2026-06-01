// ─────────────────────────────────────────────────────────────
// IMPLEMENTACIÓN MOCK DEL SERVICIO SII
// Devuelve datos FALSOS pero REALISTAS, sin conectarse a ningún lado.
// Cumple el contrato ServicioSII, así que es intercambiable con el real.
// ─────────────────────────────────────────────────────────────

import type { ServicioSII, SituacionTributaria, DatosF29 } from "./types";

// ── Helper 1: convertir un RUT en un "número semilla" ──────────
// Queremos que la MISMA empresa devuelva SIEMPRE los mismos datos
// (no que cambien cada vez que recargas). Para eso usamos el RUT
// como semilla: sumamos los códigos de cada carácter.
function semillaDesdeRut(rut: string): number {
  let semilla = 0;
  for (const char of rut) {
    semilla += char.charCodeAt(0);
  }
  return semilla;
}

// ── Helper 2: generar un número "aleatorio" pero determinista ──
// Con la misma semilla siempre da el mismo resultado. Lo usamos
// para inventar montos que se ven reales pero son estables.
function numeroPseudoAleatorio(semilla: number, min: number, max: number): number {
  // Fórmula simple de generador congruencial (siempre mismo output)
  const x = Math.sin(semilla) * 10000;
  const fraccion = x - Math.floor(x); // queda entre 0 y 1
  return Math.floor(fraccion * (max - min) + min);
}

// ── Helper 3: simular la demora de una llamada de red ──────────
// El SII real tardaría 1-2 segundos. Simulamos eso para que cuando
// cambiemos al real, la app ya esté preparada para la espera.
function simularDemora(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Datos de ejemplo para variar las respuestas
const REGIMENES = ["Pro Pyme Transparente", "Pro Pyme General", "Régimen General"];
const GIROS = [
  "Venta al por menor",
  "Servicios profesionales",
  "Construcción",
  "Transporte de carga",
  "Restaurantes y comida",
];

export class ServicioSIIMock implements ServicioSII {

  async obtenerSituacionTributaria(rut: string): Promise<SituacionTributaria> {
    await simularDemora(800); // simula la espera del SII

    const semilla = semillaDesdeRut(rut);
    const deuda = numeroPseudoAleatorio(semilla, 0, 500000);

    return {
      rut,
      razonSocial: `Empresa Demo ${rut.slice(0, 4)} SpA`,
      inicioActividades: true,
      regimen: REGIMENES[semilla % REGIMENES.length],
      actividadEconomica: GIROS[semilla % GIROS.length],
      deudaFiscal: deuda,
      alDia: deuda === 0, // si no debe nada, está al día
    };
  }

  async obtenerF29(rut: string, periodo: string): Promise<DatosF29> {
    await simularDemora(600);

    // La semilla combina RUT + período: cada mes da números distintos
    const semilla = semillaDesdeRut(rut + periodo);

    const ventasNetas = numeroPseudoAleatorio(semilla, 2000000, 15000000);
    const comprasNetas = numeroPseudoAleatorio(semilla + 1, 1000000, ventasNetas);

    const ivaDebito = Math.round(ventasNetas * 0.19);   // IVA 19% sobre ventas
    const ivaCredito = Math.round(comprasNetas * 0.19); // IVA 19% sobre compras
    const ivaDeterminado = Math.max(0, ivaDebito - ivaCredito);
    const ppm = Math.round(ventasNetas * 0.0025);       // PPM ~0.25% de ventas

    // El F29 vence el día 12 del mes siguiente al período
    const [anio, mes] = periodo.split("-").map(Number);
    const fechaVenc = new Date(anio, mes, 12); // mes (no mes-1) = mes siguiente

    return {
      periodo,
      ventasNetas,
      comprasNetas,
      ivaDebito,
      ivaCredito,
      ivaDeterminado,
      ppm,
      totalAPagar: ivaDeterminado + ppm,
      fechaVencimiento: fechaVenc.toISOString(),
    };
  }

  async obtenerHistorialF29(rut: string, cantidad: number): Promise<DatosF29[]> {
    await simularDemora(1000);

    const historial: DatosF29[] = [];
    const hoy = new Date();

    // Generamos los últimos N meses hacia atrás
    for (let i = 0; i < cantidad; i++) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
      const periodo = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}`;
      // Reutilizamos obtenerF29 pero sin la demora extra de cada uno
      const semilla = semillaDesdeRut(rut + periodo);
      const ventasNetas = numeroPseudoAleatorio(semilla, 2000000, 15000000);
      const comprasNetas = numeroPseudoAleatorio(semilla + 1, 1000000, ventasNetas);
      const ivaDebito = Math.round(ventasNetas * 0.19);
      const ivaCredito = Math.round(comprasNetas * 0.19);
      const ivaDeterminado = Math.max(0, ivaDebito - ivaCredito);
      const ppm = Math.round(ventasNetas * 0.0025);
      const [anio, mes] = periodo.split("-").map(Number);

      historial.push({
        periodo,
        ventasNetas,
        comprasNetas,
        ivaDebito,
        ivaCredito,
        ivaDeterminado,
        ppm,
        totalAPagar: ivaDeterminado + ppm,
        fechaVencimiento: new Date(anio, mes, 12).toISOString(),
      });
    }

    return historial;
  }
}
