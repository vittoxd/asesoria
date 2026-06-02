"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Brain, ShieldCheck, Smartphone, Sparkles } from "lucide-react";

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
    <div className="min-h-screen flex">
      {/* ── Panel de marca (izquierda) — oculto en móvil ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-blue-900 to-slate-950 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decoración */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-16 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center">
            <span className="text-blue-700 text-xl font-bold">A</span>
          </div>
          <span className="text-white text-xl font-bold">AsesorIA</span>
        </div>

        {/* Mensaje central */}
        <div className="relative">
          <h1 className="text-white text-4xl font-bold leading-tight">
            La contabilidad chilena,<br />ahora inteligente.
          </h1>
          <p className="text-blue-200 mt-4 text-lg">
            Automatiza el SII, la Inspección del Trabajo y las remuneraciones desde un solo lugar.
          </p>

          {/* Features */}
          <div className="mt-10 space-y-4">
            <Feature icon={Brain} texto="Chat con IA sobre tus datos financieros" />
            <Feature icon={ShieldCheck} texto="Seguridad de nivel bancario" />
            <Feature icon={Smartphone} texto="Disponible desde el celular" />
          </div>
        </div>

        <p className="relative text-blue-300/60 text-sm">© 2026 AsesorIA · Todos los derechos reservados</p>
      </div>

      {/* ── Formulario (derecha) ── */}
      <div className="w-full lg:w-1/2 bg-slate-950 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Logo en móvil */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg font-bold">A</span>
            </div>
            <span className="text-white text-xl font-bold">AsesorIA</span>
          </div>

          <div className="mb-8">
            <h2 className="text-white text-2xl font-bold">Iniciar sesión</h2>
            <p className="text-slate-400 text-sm mt-1">Ingresa con tu cuenta de contador</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@correo.cl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 h-11"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={cargando}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold h-11 transition-colors"
            >
              {cargando ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>

          {/* Credenciales demo */}
          <div className="mt-6 bg-slate-900 border border-slate-800 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Sparkles size={13} /> Cuenta de demostración
            </div>
            <p className="text-slate-500 text-xs">
              admin@demo.cl &nbsp;·&nbsp; demo1234
            </p>
          </div>

          {/* Link a registro */}
          <p className="text-slate-500 text-sm text-center mt-6">
            ¿No tienes cuenta?{" "}
            <a href="/registro" className="text-blue-400 hover:text-blue-300">Crea tu estudio</a>
          </p>
        </div>
      </div>
    </div>
  );
}

// Componente chico para cada feature del panel de marca
function Feature({ icon: Icono, texto }: { icon: React.ComponentType<{ size?: number; className?: string }>; texto: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
        <Icono size={18} className="text-white" />
      </div>
      <span className="text-blue-100">{texto}</span>
    </div>
  );
}
