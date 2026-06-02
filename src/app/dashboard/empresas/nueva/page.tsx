// Formulario para crear empresa
import Link from "next/link";
import { crearEmpresa } from "../actions";
import { FormEmpresa } from "../FormEmpresa";
import { ArrowLeft } from "lucide-react";

export default function NuevaEmpresaPage() {
  return (
    <main className="max-w-2xl mx-auto px-8 py-10">
      <Link href="/dashboard/empresas" className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-sm">
        <ArrowLeft size={14} /> Volver a empresas
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">Nueva empresa</h1>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8">
        <FormEmpresa accion={crearEmpresa} textoBoton="Guardar empresa" />
      </div>
    </main>
  );
}
