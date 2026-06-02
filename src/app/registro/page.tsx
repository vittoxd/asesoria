"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registrarEstudio } from "./actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function RegistroPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCargando(true);
    setError("");

    // Tomamos los datos del formulario
    const formData = new FormData(e.currentTarget);

    try {
      // Llamamos a la server action (la escribimos después)
      await registrarEstudio(formData);
      // Si todo salió bien, lo mandamos al login
      router.push("/login?registrado=1");
    } catch (err: any) {
      setError(err?.message ?? "No se pudo crear la cuenta.");
      setCargando(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg font-bold">A</span>
          </div>
          <span className="text-white text-xl font-bold">AsesorIA</span>
        </div>

        <div className="mb-6">
          <h2 className="text-white text-2xl font-bold">Crear cuenta</h2>
          <p className="text-slate-400 text-sm mt-1">Registra tu estudio contable</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="estudioNombre" className="text-slate-300">Nombre del estudio</Label>
            <Input id="estudioNombre" name="estudioNombre" placeholder="Estudio Contable Pérez"
              required className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombre" className="text-slate-300">Tu nombre</Label>
            <Input id="nombre" name="nombre" placeholder="Juan Pérez"
              required className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300">Correo electrónico</Label>
            <Input id="email" name="email" type="email" placeholder="tu@correo.cl"
              required className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-300">Contraseña</Label>
            <Input id="password" name="password" type="password" placeholder="••••••••"
              required minLength={6} className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <Button type="submit" disabled={cargando}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold h-11">
            {cargando ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </form>

        <p className="text-slate-500 text-sm text-center mt-6">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-blue-400 hover:text-blue-300">Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}