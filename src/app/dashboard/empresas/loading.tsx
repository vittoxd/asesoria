// Skeleton de la lista de empresas
export default function CargandoEmpresas() {
  return (
    <main className="max-w-7xl mx-auto px-8 py-10 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-7 w-40 bg-slate-800 rounded" />
        <div className="h-9 w-40 bg-slate-800 rounded-lg" />
      </div>
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-5 bg-slate-700/60 rounded" />
        ))}
      </div>
    </main>
  );
}
