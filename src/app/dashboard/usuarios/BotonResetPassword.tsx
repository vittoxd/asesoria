"use client";

// Botón + modal para que el admin restablezca la contraseña de un usuario
import { useState } from "react";
import { restablecerPassword } from "./actions";
import { Input } from "@/components/ui/input";
import { KeyRound } from "lucide-react";

export function BotonResetPassword({
  usuarioId,
  email,
}: {
  usuarioId: string;
  email: string;
}) {
  const [abierto, setAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);

  return (
    <>
      <button
        onClick={() => setAbierto(true)}
        className="flex items-center gap-1 text-slate-400 hover:text-white text-sm"
      >
        <KeyRound size={14} /> Restablecer clave
      </button>

      {abierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setAbierto(false)} />
          <div className="relative bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-1">Restablecer contraseña</h3>
            <p className="text-slate-400 text-sm mb-4">Nueva clave para <span className="text-white">{email}</span></p>

            <form action={restablecerPassword.bind(null, usuarioId)} onSubmit={() => setGuardando(true)}>
              <Input
                name="password"
                type="password"
                placeholder="Nueva contraseña (mín. 6)"
                required
                minLength={6}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 mb-4"
              />
              <div className="flex items-center justify-end gap-3">
                <button type="button" onClick={() => setAbierto(false)} className="text-slate-400 hover:text-white text-sm font-medium px-4 py-2">
                  Cancelar
                </button>
                <button type="submit" disabled={guardando}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
                  {guardando ? "Guardando..." : "Restablecer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
