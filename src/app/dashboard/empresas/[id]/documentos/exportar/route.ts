// ─────────────────────────────────────────────────────────────
// EXPORTAR DOCUMENTOS A CSV
// Genera un archivo CSV con todos los documentos de la empresa y
// lo devuelve como descarga. Se abre directo en Excel.
// URL: /dashboard/empresas/[id]/documentos/exportar
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { empresaAccesible } from "@/lib/accesoEmpresas";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Seguridad: solo si el usuario puede acceder a esta empresa
  const sesion = await auth();
  const empresa = sesion?.user ? await empresaAccesible(sesion.user, id) : null;
  if (!empresa) {
    return new NextResponse("No autorizado", { status: 403 });
  }

  const documentos = await prisma.documento.findMany({
    where: { empresaId: id },
    orderBy: { fecha: "desc" },
  });

  // Construir el CSV
  const encabezados = ["Tipo", "Folio", "RUT Receptor", "Fecha", "Neto", "IVA", "Total"];
  const filas = documentos.map((d) => [
    d.tipo,
    d.folio ?? "",
    d.rutReceptor ?? "",
    d.fecha.toISOString().slice(0, 10), // YYYY-MM-DD
    d.montoNeto ?? 0,
    d.iva ?? 0,
    d.montoTotal ?? 0,
  ]);

  // Unir todo con ; (Excel en español usa punto y coma como separador)
  const lineas = [encabezados, ...filas].map((fila) => fila.join(";"));
  // El BOM (﻿) hace que Excel muestre bien los acentos
  const csv = "﻿" + lineas.join("\n");

  const nombreArchivo = `documentos-${empresa.rut}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${nombreArchivo}"`,
    },
  });
}
