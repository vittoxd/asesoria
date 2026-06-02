"use client";

// ─────────────────────────────────────────────────────────────
// FORMULARIO DE EMPRESA (crear o editar) con useActionState
// useActionState captura lo que devuelve la server action. Si
// devuelve { error }, lo mostramos bonito sin recargar la página.
// ─────────────────────────────────────────────────────────────

import { useActionState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { FormState } from "./actions";

type Empresa = {
  rut: string;
  razonSocial: string;
  giro: string | null;
  comuna: string | null;
};

export function FormEmpresa({
  accion,
  empresa,
  textoBoton,
}: {
  accion: (prev: FormState, formData: FormData) => Promise<FormState>;
  empresa?: Empresa; // si viene, es modo edición
  textoBoton: string;
}) {
  const [state, formAction, pending] = useActionState(accion, {});
  const esEdicion = !!empresa;

  return (
    <form action={formAction} className="space-y-5">
      {/* RUT: editable al crear, bloqueado al editar */}
      <div className="space-y-2">
        <Label htmlFor="rut" className="text-slate-300">
          RUT {!esEdicion && <span className="text-red-400">*</span>}
          {esEdicion && <span className="text-slate-500"> (no editable)</span>}
        </Label>
        <Input
          id="rut"
          name="rut"
          placeholder="76.123.456-7"
          required={!esEdicion}
          disabled={esEdicion}
          defaultValue={empresa?.rut ?? ""}
          className={`border-slate-600 text-white placeholder:text-slate-500 ${
            esEdicion ? "bg-slate-900 text-slate-500 cursor-not-allowed" : "bg-slate-700"
          }`}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="razonSocial" className="text-slate-300">
          Razón social <span className="text-red-400">*</span>
        </Label>
        <Input id="razonSocial" name="razonSocial" placeholder="Comercializadora Demo SpA" required
          defaultValue={empresa?.razonSocial ?? ""}
          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="giro" className="text-slate-300">Giro</Label>
        <Input id="giro" name="giro" placeholder="Venta al por menor"
          defaultValue={empresa?.giro ?? ""}
          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="comuna" className="text-slate-300">Comuna</Label>
        <Input id="comuna" name="comuna" placeholder="Rancagua"
          defaultValue={empresa?.comuna ?? ""}
          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500" />
      </div>

      {/* Mensaje de error (si la action devolvió uno) */}
      {state?.error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
          <p className="text-red-400 text-sm">{state.error}</p>
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={pending} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold disabled:opacity-50">
          {pending ? "Guardando..." : textoBoton}
        </Button>
        <Link href="/dashboard/empresas" className="text-slate-400 hover:text-white text-sm">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
