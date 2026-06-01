"use client";

// ─────────────────────────────────────────────────────────────
// GRÁFICO DEL HISTORIAL F29 (Client Component)
// Recharts dibuja en el navegador, por eso "use client".
// Recibe el historial y muestra un gráfico de barras del total
// a pagar mes a mes.
// ─────────────────────────────────────────────────────────────

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { formatearCLP } from "@/lib/formato";

type DatoMes = {
  periodo: string;
  totalAPagar: number;
  ventasNetas: number;
};

const MESES_CORTOS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export function GraficoF29({ historial }: { historial: DatoMes[] }) {
  // El mock viene del más nuevo al más viejo; lo invertimos para
  // que el gráfico vaya de izquierda (viejo) a derecha (nuevo).
  const datos = [...historial].reverse().map((mes) => {
    const [, m] = mes.periodo.split("-").map(Number);
    return {
      mes: MESES_CORTOS[m - 1],
      total: mes.totalAPagar,
      ventas: mes.ventasNetas,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={datos} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
        <XAxis dataKey="mes" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#94a3b8"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          cursor={{ fill: "#1e293b" }}
          contentStyle={{
            backgroundColor: "#0f172a",
            border: "1px solid #334155",
            borderRadius: "8px",
            color: "#fff",
          }}
          formatter={(value) => [formatearCLP(Number(value)), "Total a pagar"]}
        />
        <Bar dataKey="total" fill="#3b82f6" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
