// Dashboard principal — solo accesible con sesión activa
import { auth, signOut } from "@/auth";

export default async function DashboardPage() {
  const sesion = await auth();
  const usuario = sesion?.user;

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-lg">AsesorIA</span>
            {usuario?.estudioNombre && (
              <span className="text-slate-500 text-sm">
                · {usuario.estudioNombre}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm">{usuario?.email}</span>
            <form action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}>
              <button
                type="submit"
                className="text-slate-400 hover:text-white text-sm transition-colors"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">
            Bienvenido, {usuario?.name} 👋
          </h1>
          <p className="text-slate-400 mt-1">
            Rol:{" "}
            <span className="text-blue-400 font-medium">
              {usuario?.rol}
            </span>
          </p>
        </div>

        {/* Cards de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <p className="text-slate-400 text-sm mb-1">Empresas activas</p>
            <p className="text-3xl font-bold">0</p>
            <p className="text-slate-500 text-xs mt-2">Agrega tu primera empresa →</p>
          </div>
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <p className="text-slate-400 text-sm mb-1">Declaraciones pendientes</p>
            <p className="text-3xl font-bold text-yellow-400">0</p>
            <p className="text-slate-500 text-xs mt-2">Al día por ahora ✓</p>
          </div>
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <p className="text-slate-400 text-sm mb-1">Próximo vencimiento</p>
            <p className="text-3xl font-bold text-red-400">—</p>
            <p className="text-slate-500 text-xs mt-2">Sin alertas activas</p>
          </div>
        </div>

        {/* Placeholder módulos */}
        <div className="mt-10 bg-slate-800/50 border border-slate-700 border-dashed rounded-2xl p-10 text-center">
          <p className="text-slate-500">🚧 Módulos en construcción</p>
          <p className="text-slate-600 text-sm mt-1">Empresas · SII · Remuneraciones · IA</p>
        </div>
      </main>
    </div>
  );
}
