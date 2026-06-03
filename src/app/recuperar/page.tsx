"use client";

// Página: solicitar recuperación de contraseña
import { useActionState } from "react";
import Link from "next/link";
import { solicitarReset } from "./actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function RecuperarPage() {
  const [state, formAction, pending] = useActionState(solicitarReset, {});

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg font-bold">A</span>
          </div>
          <span className="text-white text-xl font-bold">AsesorIA</span>
        </div>

        <div className="mb-6">
          <h2 className="text-white text-2xl font-bold">Recuperar contraseña</h2>
          <p className="text-slate-400 text-sm mt-1">Te enviaremos un enlace para crear una nueva.</p>
        </div>

        {/* Si se generó el link (modo demo), lo mostramos */}
        {state.link ? (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-4">
            <p className="text-green-400 text-sm font-medium mb-2">✓ Enlace de recuperación generado</p>
            <p className="text-slate-400 text-xs mb-3">
              En producción esto llegaría a tu correo. Por ahora, abre el enlace:
            </p>
            <Link href={state.link} className="text-blue-400 hover:text-blue-300 text-sm underline break-all">
              {state.link}
            </Link>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Correo electrónico</Label>
              <Input id="email" name="email" type="email" placeholder="tu@correo.cl" required
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-11" />
            </div>

            {state.error && (
              <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3">
                <p className="text-slate-400 text-sm">{state.error}</p>
              </div>
            )}

            <Button type="submit" disabled={pending} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold h-11 disabled:opacity-50">
              {pending ? "Generando..." : "Enviar enlace"}
            </Button>
          </form>
        )}

        <p className="text-slate-500 text-sm text-center mt-6">
          <Link href="/login" className="text-blue-400 hover:text-blue-300">Volver a iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
}
