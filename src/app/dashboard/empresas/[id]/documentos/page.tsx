// Documentos de una empresa (facturas, boletas, notas de crédito)
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { empresaAccesible } from "@/lib/accesoEmpresas";
import { crearDocumento } from "./actions";
import { formatearCLP, formatearFecha } from "@/lib/formato";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Download } from "lucide-react";

export default async function DocumentosPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const sesion = await auth();
  const empresa = sesion?.user ? await empresaAccesible(sesion.user, id) : null;
  if (!empresa) notFound();

  const documentos = await prisma.documento.findMany({
    where: { empresaId: id },
    orderBy: { fecha: "desc" },
  });

  const totalDocs = documentos.reduce((s, d) => s + (d.montoTotal ?? 0), 0);

  return (
    <main className="max-w-5xl mx-auto px-8 py-10">
      <Link href={`/dashboard/empresas/${id}`} className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-sm">
        <ArrowLeft size={14} /> Volver a la empresa
      </Link>
      <div className="flex items-start justify-between mt-2 mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Documentos</h1>
          <p className="text-slate-500 text-sm">{empresa.razonSocial}</p>
        </div>
        {documentos.length > 0 && (
          <a
            href={`/dashboard/empresas/${id}/documentos/exportar`}
            className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <Download size={16} /> Exportar a Excel
          </a>
        )}
      </div>

      {/* Formulario */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 mb-6">
        <h2 className="text-sm font-semibold text-slate-400 uppercase mb-4">Registrar documento</h2>
        <form action={crearDocumento.bind(null, id)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tipo" className="text-slate-300">Tipo</Label>
            <select id="tipo" name="tipo" className="block w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 text-sm">
              <option value="factura">Factura</option>
              <option value="boleta">Boleta</option>
              <option value="nota_credito">Nota de crédito</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="folio" className="text-slate-300">Folio</Label>
            <Input id="folio" name="folio" type="number" placeholder="1234" className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rutReceptor" className="text-slate-300">RUT receptor</Label>
            <Input id="rutReceptor" name="rutReceptor" placeholder="77.888.999-0" className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fecha" className="text-slate-300">Fecha <span className="text-red-400">*</span></Label>
            <Input id="fecha" name="fecha" type="date" required className="bg-slate-700 border-slate-600 text-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="montoNeto" className="text-slate-300">Monto neto (CLP) <span className="text-red-400">*</span></Label>
            <Input id="montoNeto" name="montoNeto" type="number" placeholder="100000" required min="0" className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500" />
          </div>
          <div className="flex items-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold">
              Registrar (IVA 19% automático)
            </Button>
          </div>
        </form>
      </div>

      {/* Lista */}
      {documentos.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700 border-dashed rounded-2xl p-12 text-center">
          <div className="w-14 h-14 mx-auto bg-blue-500/10 rounded-2xl flex items-center justify-center mb-3">
            <FileText className="text-blue-400" size={24} />
          </div>
          <p className="text-slate-400">No hay documentos registrados.</p>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-slate-900/50 text-slate-400">
              <tr>
                <th className="text-left font-medium px-6 py-3">Tipo</th>
                <th className="text-left font-medium px-6 py-3">Folio</th>
                <th className="text-left font-medium px-6 py-3">Fecha</th>
                <th className="text-right font-medium px-6 py-3">Neto</th>
                <th className="text-right font-medium px-6 py-3">IVA</th>
                <th className="text-right font-medium px-6 py-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {documentos.map((d) => (
                <tr key={d.id} className="border-t border-slate-700 hover:bg-slate-700/30">
                  <td className="px-6 py-4 font-medium capitalize">{d.tipo.replace("_", " ")}</td>
                  <td className="px-6 py-4 text-slate-300">{d.folio ?? "—"}</td>
                  <td className="px-6 py-4 text-slate-400">{formatearFecha(d.fecha.toISOString())}</td>
                  <td className="px-6 py-4 text-right text-slate-300">{formatearCLP(d.montoNeto ?? 0)}</td>
                  <td className="px-6 py-4 text-right text-slate-400">{formatearCLP(d.iva ?? 0)}</td>
                  <td className="px-6 py-4 text-right font-bold text-blue-400">{formatearCLP(d.montoTotal ?? 0)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-900/50 font-semibold">
              <tr className="border-t border-slate-600">
                <td className="px-6 py-3" colSpan={5}>Total documentos</td>
                <td className="px-6 py-3 text-right text-blue-400">{formatearCLP(totalDocs)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </main>
  );
}
