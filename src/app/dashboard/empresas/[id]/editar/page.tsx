// Editar empresa
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { actualizarEmpresa } from "../../actions";
import { FormEmpresa } from "../../FormEmpresa";
import { ArrowLeft } from "lucide-react";

export default async function EditarEmpresaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const sesion = await auth();
  const estudioId = sesion?.user?.estudioId;
  const empresa = estudioId
    ? await prisma.empresa.findFirst({ where: { id, estudioId } })
    : null;

  if (!empresa) {
    notFound();
  }

  return (
    <main className="max-w-2xl mx-auto px-8 py-10">
      <Link href="/dashboard/empresas" className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-sm">
        <ArrowLeft size={14} /> Volver a empresas
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">Editar empresa</h1>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8">
        <FormEmpresa
          accion={actualizarEmpresa.bind(null, empresa.id)}
          empresa={{
            rut: empresa.rut,
            razonSocial: empresa.razonSocial,
            giro: empresa.giro,
            comuna: empresa.comuna,
          }}
          textoBoton="Guardar cambios"
        />
      </div>
    </main>
  );
}
