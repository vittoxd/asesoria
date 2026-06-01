"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError("");

    try {
      const resultado = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (resultado?.error) {
        if (resultado.error.includes("CUENTA_INACTIVA")) {
          setError("Tu cuenta está desactivada. Contacta al administrador.");
        } else {
          setError("Email o contraseña incorrectos.");
        }
        setCargando(false);
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      if (err?.message?.includes("CUENTA_INACTIVA")) {
        setError("Tu cuenta está desactivada. Contacta al administrador.");
      } else {
        setError("Email o contraseña incorrectos.");
      }
      setCargando(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/25">
            <span className="text-white text-2xl font-bold">A</span>
          </div>
          <h1 className="text-3xl font-bold text-white">AsesorIA</h1>
          <p className="text-blue-300 mt-1 text-sm">Contabilidad inteligente para Chile</p>
        </div>

        {/* Card de login */}
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-xl">Iniciar sesión</CardTitle>
            <CardDescription className="text-slate-400">
              Ingresa con tu cuenta de contador
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@correo.cl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
                />
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Botón */}
              <Button
                type="submit"
                disabled={cargando}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 transition-colors"
              >
                {cargando ? "Ingresando..." : "Ingresar"}
              </Button>

            </form>

            {/* Divider */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <p className="text-slate-500 text-xs text-center">
                ¿Problemas para ingresar? Contacta a tu administrador.
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-slate-600 text-xs mt-6">
          AsesorIA © 2026 · Todos los derechos reservados
        </p>
      </div>
    </div>
  );
}
