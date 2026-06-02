"use client";

// ─────────────────────────────────────────────────────────────
// CONTROLES DE LIQUIDACIÓN (Client Component)
// Selector de mes + botón para generar. Al cambiar el mes,
// navega a ?periodo=YYYY-MM para que la página recargue los datos.
// ─────────────────────────────────────────────────────────────

import { useRouter } from "next/navigation";
import { useState } from "react";
import { generarLiquidaciones } from "./actions";

export function ControlesLiquidacion({
  empresaId,
  periodo,
}: {
  empresaId: string;
  periodo: string;
}) {
  const router = useRouter();
  const [generando, setGenerando] = useState(false);

  return (
    <div className="flex flex-wrap items-end gap-4 mb-6">
      <div className="space-y-1.5">
        <label className="text-slate-300 text-sm">Período</label>
        <input
          type="month"
          defaultValue={periodo}
          onChange={(e) => router.push(`?periodo=${e.target.value}`)}
          className="block bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 text-sm"
        />
      </div>

      <form
        action={generarLiquidaciones.bind(null, empresaId, periodo)}
        onSubmit={() => setGenerando(true)}
      >
        <button
          type="submit"
          disabled={generando}
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {generando ? "Generando..." : "Generar liquidaciones"}
        </button>
      </form>
    </div>
  );
}
