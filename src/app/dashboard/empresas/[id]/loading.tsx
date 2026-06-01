// ─────────────────────────────────────────────────────────────
// LOADING SKELETON del detalle de empresa
// Next.js muestra ESTE archivo automáticamente mientras la página
// (page.tsx) está cargando sus datos. No hay que llamarlo: la
// convención loading.tsx lo activa solo.
// La clase "animate-pulse" hace el efecto de parpadeo gris.
// ─────────────────────────────────────────────────────────────

export default function CargandoDetalle() {
  return (
    <main className="max-w-5xl mx-auto px-8 py-10 space-y-6 animate-pulse">
      {/* Encabezado */}
      <div>
        <div className="h-4 w-32 bg-slate-800 rounded mb-3" />
        <div className="h-7 w-64 bg-slate-800 rounded mb-2" />
        <div className="h-4 w-28 bg-slate-800 rounded" />
      </div>

      {/* Datos de la empresa */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
        <div className="h-4 w-40 bg-slate-700 rounded mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <div className="h-3 w-16 bg-slate-700 rounded mb-2" />
              <div className="h-4 w-24 bg-slate-700 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Estado SII + F29 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 h-32" />
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 h-32 md:col-span-2" />
      </div>

      {/* Gráfico */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
        <div className="h-4 w-40 bg-slate-700 rounded mb-4" />
        <div className="h-56 bg-slate-700/50 rounded" />
      </div>
    </main>
  );
}
