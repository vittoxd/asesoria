// Skeleton del dashboard (mientras carga la situación SII de cada empresa)
export default function CargandoDashboard() {
  return (
    <main className="max-w-7xl mx-auto px-8 py-10 animate-pulse">
      <div className="mb-8">
        <div className="h-7 w-72 bg-slate-800 rounded mb-2" />
        <div className="h-4 w-24 bg-slate-800 rounded" />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 h-28">
            <div className="h-3 w-28 bg-slate-700 rounded mb-3" />
            <div className="h-8 w-16 bg-slate-700 rounded" />
          </div>
        ))}
      </div>

      {/* Empresas */}
      <div className="mt-10">
        <div className="h-5 w-32 bg-slate-800 rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-800/50 rounded-2xl border border-slate-700 p-5 h-28" />
          ))}
        </div>
      </div>
    </main>
  );
}
