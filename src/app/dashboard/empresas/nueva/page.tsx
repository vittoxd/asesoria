// ─────────────────────────────────────────────────────────────
// FORMULARIO PARA CREAR UNA EMPRESA
// Server Component: el <form> llama directo a la server action
// crearEmpresa, sin necesidad de JavaScript en el navegador.
// ─────────────────────────────────────────────────────────────

import Link from "next/link";
import { crearEmpresa } from "../actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function NuevaEmpresaPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Encabezado */}
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link href="/dashboard/empresas" className="text-slate-400 hover:text-white text-sm">
            ← Volver
          </Link>
          <span className="font-bold text-lg">Nueva empresa</span>
        </div>
      </header>

      {/* Formulario */}
      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8">
          {/*
            La clave: action={crearEmpresa} conecta el form con la
            server action. Cada input lleva un "name" que DEBE calzar
            con lo que crearEmpresa lee con formData.get(...)
          */}
          <form action={crearEmpresa} className="space-y-5">

            {/* RUT (obligatorio) */}
            <div className="space-y-2">
              <Label htmlFor="rut" className="text-slate-300">
                RUT <span className="text-red-400">*</span>
              </Label>
              <Input
                id="rut"
                name="rut"
                placeholder="76.123.456-7"
                required
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>

            {/* Razón social (obligatorio) */}
            <div className="space-y-2">
              <Label htmlFor="razonSocial" className="text-slate-300">
                Razón social <span className="text-red-400">*</span>
              </Label>
              <Input
                id="razonSocial"
                name="razonSocial"
                placeholder="Comercializadora Demo SpA"
                required
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>

            {/* Giro (opcional) */}
            <div className="space-y-2">
              <Label htmlFor="giro" className="text-slate-300">
                Giro
              </Label>
              <Input
                id="giro"
                name="giro"
                placeholder="Venta al por menor"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>

            {/* Comuna (opcional) */}
            <div className="space-y-2">
              <Label htmlFor="comuna" className="text-slate-300">
                Comuna
              </Label>
              <Input
                id="comuna"
                name="comuna"
                placeholder="Rancagua"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>

            {/* Botones */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold"
              >
                Guardar empresa
              </Button>
              <Link
                href="/dashboard/empresas"
                className="text-slate-400 hover:text-white text-sm"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
