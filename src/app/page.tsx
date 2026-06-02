// Landing page pública de AsesorIA
import Link from "next/link";
import { Brain, ShieldCheck, Smartphone, Building2, Wallet, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <header className="border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="font-bold text-lg">AsesorIA</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-slate-300 hover:text-white text-sm">Iniciar sesión</Link>
            <Link href="/registro" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              Crear cuenta
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <Brain size={14} /> Contabilidad con inteligencia artificial
        </div>
        <h1 className="text-5xl font-bold leading-tight">
          La contabilidad chilena,<br />
          <span className="text-blue-500">ahora inteligente.</span>
        </h1>
        <p className="text-slate-400 text-lg mt-6 max-w-2xl mx-auto">
          Automatiza el SII, la Inspección del Trabajo y las remuneraciones de todas tus
          empresas desde un solo lugar. Sin planillas, sin perder tiempo.
        </p>
        <div className="flex items-center justify-center gap-3 mt-8">
          <Link href="/registro" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
            Empieza gratis
          </Link>
          <Link href="/login" className="border border-slate-700 hover:border-slate-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
            Ver demo
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Building2, titulo: "Multi-empresa", texto: "Gestiona todas las empresas de tu estudio desde un panel, cada una aislada y segura." },
            { icon: BarChart3, titulo: "Datos del SII", texto: "F29, historial tributario y estado de cada empresa, siempre actualizados." },
            { icon: Wallet, titulo: "Remuneraciones", texto: "Calcula liquidaciones de sueldo automáticamente: AFP, salud y líquido a pagar." },
            { icon: Brain, titulo: "Inteligencia Artificial", texto: "Pregúntale a tus datos en lenguaje natural y recibe resúmenes automáticos." },
            { icon: ShieldCheck, titulo: "Seguridad bancaria", texto: "Roles, cifrado y registro de cada acción. Tus datos protegidos siempre." },
            { icon: Smartphone, titulo: "Desde cualquier lado", texto: "Funciona en computador o celular, sin instalar nada." },
          ].map((f) => {
            const Icono = f.icon;
            return (
              <div key={f.titulo} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <div className="w-11 h-11 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                  <Icono size={22} className="text-blue-400" />
                </div>
                <h3 className="font-semibold text-lg">{f.titulo}</h3>
                <p className="text-slate-400 text-sm mt-1.5">{f.texto}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-3xl p-12">
          <h2 className="text-3xl font-bold">¿Listo para ordenar tu estudio?</h2>
          <p className="text-blue-200 mt-3">Crea tu cuenta en menos de un minuto.</p>
          <Link href="/registro" className="inline-block mt-6 bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
            Crear cuenta gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-slate-500 text-sm">
          AsesorIA © 2026 · Contabilidad inteligente para Chile
        </div>
      </footer>
    </div>
  );
}
