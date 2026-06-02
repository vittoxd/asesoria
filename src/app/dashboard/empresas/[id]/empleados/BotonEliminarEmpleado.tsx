"use client";

// Botón eliminar empleado con modal de confirmación (mismo patrón que empresas)
import { useState } from "react";
import { eliminarEmpleado } from "./actions";
import { Trash2, AlertTriangle } from "lucide-react";

export function BotonEliminarEmpleado({
  empresaId,
  empleadoId,
  nombre,
}: {
  empresaId: string;
  empleadoId: string;
  nombre: string;
}) {
  const [abierto, setAbierto] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  return (
    <>
      <button
        onClick={() => setAbierto(true)}
        className="flex items-center gap-1 text-red-400 hover:text-red-300"
      >
        <Trash2 size={14} /> Eliminar
      </button>

      {abierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setAbierto(false)} />
          <div className="relative bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center shrink-0">
                <AlertTriangle size={20} className="text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Eliminar empleado</h3>
            </div>
            <p className="text-slate-400 text-sm mb-6">
              ¿Seguro que quieres eliminar a <span className="text-white font-medium">{nombre}</span>?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setAbierto(false)} className="text-slate-400 hover:text-white text-sm font-medium px-4 py-2">
                Cancelar
              </button>
              <form action={eliminarEmpleado.bind(null, empresaId, empleadoId)} onSubmit={() => setEliminando(true)}>
                <button type="submit" disabled={eliminando}
                  className="bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
                  {eliminando ? "Eliminando..." : "Sí, eliminar"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
