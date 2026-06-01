// ─────────────────────────────────────────────────────────────
// RUTA DE PRUEBA — solo para verificar que los mocks funcionan.
// La borraremos cuando conectemos los servicios a la UI real.
// Abrir en: http://localhost:3000/api/demo-servicios?rut=76123456-7
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { obtenerServicioSII } from "@/lib/services/sii";
import { obtenerServicioDT } from "@/lib/services/dt";

export async function GET(req: NextRequest) {
  // Tomamos el RUT de la URL, o usamos uno de ejemplo
  const rut = req.nextUrl.searchParams.get("rut") ?? "76123456-7";

  // Pedimos los servicios a las fábricas (nos dan los mocks)
  const sii = obtenerServicioSII();
  const dt = obtenerServicioDT();

  // Llamamos a todo en paralelo para que sea más rápido
  const [situacionTributaria, f29Actual, historial, situacionLaboral] =
    await Promise.all([
      sii.obtenerSituacionTributaria(rut),
      sii.obtenerF29(rut, "2026-05"),
      sii.obtenerHistorialF29(rut, 6),
      dt.obtenerSituacionLaboral(rut),
    ]);

  return NextResponse.json({
    rut,
    sii: {
      situacionTributaria,
      f29Actual,
      historial,
    },
    inspeccionTrabajo: situacionLaboral,
  });
}
