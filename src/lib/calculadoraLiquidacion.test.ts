// ─────────────────────────────────────────────────────────────
// TESTS de la calculadora de liquidación
// Verifican que el cálculo de sueldos sea correcto. Como es una
// función pura, es muy fácil de testear: le damos datos conocidos
// y comprobamos que el resultado sea el esperado.
// Ejecutar con: npm test
// ─────────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest";
import { calcularLiquidacion } from "./calculadoraLiquidacion";

describe("calcularLiquidacion", () => {
  it("calcula bien un sueldo base simple", () => {
    const r = calcularLiquidacion({ sueldoBase: 650000 });

    expect(r.imponible).toBe(650000);
    expect(r.cotizacionAFP).toBe(65000);    // 10%
    expect(r.cotizacionSalud).toBe(45500);  // 7%
    expect(r.liquidoAPagar).toBe(539500);   // 650000 - 65000 - 45500
  });

  it("suma horas extra y bonos al imponible", () => {
    const r = calcularLiquidacion({
      sueldoBase: 500000,
      horasExtra: 50000,
      bonos: 50000,
    });

    expect(r.imponible).toBe(600000); // 500000 + 50000 + 50000
    expect(r.cotizacionAFP).toBe(60000);
    expect(r.cotizacionSalud).toBe(42000);
  });

  it("resta otros descuentos del líquido", () => {
    const r = calcularLiquidacion({
      sueldoBase: 600000,
      descuentos: 20000,
    });

    // imponible 600000, AFP 60000, salud 42000, menos 20000 extra
    expect(r.liquidoAPagar).toBe(600000 - 60000 - 42000 - 20000);
  });

  it("redondea a peso entero (sin decimales)", () => {
    const r = calcularLiquidacion({ sueldoBase: 650333 });

    // 650333 * 0.10 = 65033.3 → debe redondear a 65033
    expect(Number.isInteger(r.cotizacionAFP)).toBe(true);
    expect(r.cotizacionAFP).toBe(65033);
  });

  it("funciona sin opcionales (solo sueldo base)", () => {
    const r = calcularLiquidacion({ sueldoBase: 1000000 });

    expect(r.imponible).toBe(1000000);
    expect(r.liquidoAPagar).toBe(1000000 - 100000 - 70000); // 830000
  });
});
