// Formulario para crear empresa — dentro del layout con sidebar
import Link from "next/link";
import { crearEmpresa } from "../actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NuevaEmpresaPage() {
  return (
    <main className="max-w-2xl mx-auto px-8 py-10">
      <Link
        href="/dashboard/empresas"
        className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-sm"
      >
        <ArrowLeft size={14} /> Volver a empresas
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">Nueva empresa</h1>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8">
        <form action={crearEmpresa} className="space-y-5">
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

          <div className="space-y-2">
            <Label htmlFor="giro" className="text-slate-300">Giro</Label>
            <Input
              id="giro"
              name="giro"
              placeholder="Venta al por menor"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comuna" className="text-slate-300">Comuna</Label>
            <Input
              id="comuna"
              name="comuna"
              placeholder="Rancagua"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold">
              Guardar empresa
            </Button>
            <Link href="/dashboard/empresas" className="text-slate-400 hover:text-white text-sm">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
