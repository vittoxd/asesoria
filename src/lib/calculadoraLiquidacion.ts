const TASA_AFP = 0.1;
const TASA_SALUD = 0.07;

type DatosLiquidacion = {
  sueldoBase: number;
  horasExtra?: number;
  bonos?: number;
  descuentos?: number;
};

type ResultadoLiquidacion = {
  imponible: number;
  cotizacionAFP: number;
  cotizacionSalud: number;
  liquidoAPagar: number;
};

export function calcularLiquidacion(
  datos: DatosLiquidacion,
): ResultadoLiquidacion {
  const horasExtra = datos.horasExtra ?? 0;
  const bonos = datos.bonos ?? 0;
  const descuentos = datos.descuentos ?? 0;

  const imponible = datos.sueldoBase + horasExtra + bonos;

  const cotizacionAFP = Math.round(imponible * TASA_AFP);
  const cotizacionSalud = Math.round(imponible * TASA_SALUD);

  const liquidoAPagar =
    imponible - cotizacionAFP - cotizacionSalud - descuentos;

  return {
    imponible,
    cotizacionAFP,
    cotizacionSalud,
    liquidoAPagar,
  };
}
