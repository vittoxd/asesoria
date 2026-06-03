"use client";

// Página: crear nueva contraseña usando el token del enlace
import { useActionState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { restablecerConToken } from "../actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function NuevaPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  // Pre-llenamos el token en la action con bind
  const [state, formAction, pending] = useActionState(
    restablecerConToken.bind(null, token),
    {}
  );

  // Al tener éxito, redirigir al login
  useEffect(() => {
    if (state.ok) {
      router.push("/login?reset=1");
    }
  }, [state.ok, router]);

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
          <h2 className="text-white text-2xl font-bold">Nueva contraseña</h2>
          <p className="text-slate-400 text-sm mt-1">Elige una contraseña nueva para tu cuenta.</p>
        </div>

        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-300">Nueva contraseña</Label>
            <Input id="password" name="password" type="password" placeholder="••••••••" required minLength={6}
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-11" />
          </div>

          {state.error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
              <p className="text-red-400 text-sm">{state.error}</p>
            </div>
          )}

          <Button type="submit" disabled={pending} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold h-11 disabled:opacity-50">
            {pending ? "Guardando..." : "Cambiar contraseña"}
          </Button>
        </form>

        <p className="text-slate-500 text-sm text-center mt-6">
          <Link href="/login" className="text-blue-400 hover:text-blue-300">Volver a iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
}
