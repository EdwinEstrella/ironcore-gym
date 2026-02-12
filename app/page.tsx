import Link from "next/link";
import { LogIn, UserPlus, Eye } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <span className="text-white text-xl font-bold">IC</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">IronCore Gym</h1>
                <p className="text-slate-400 text-sm">Sistema de gestión multi-tenant</p>
              </div>
            </div>
            <Link
              href="/demo"
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all"
            >
              <Eye className="text-emerald-400" size={18} strokeWidth={2} />
              <span className="text-slate-300 text-sm">Demo</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Bienvenido a <span className="text-emerald-400">IronCore</span>
              </h2>
              <p className="text-slate-400">
                Selecciona cómo deseas ingresar al sistema
              </p>
            </div>

            <div className="space-y-4">
              {/* Login Button */}
              <Link
                href="/login"
                className="w-full flex items-center justify-between p-5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/30 rounded-xl flex items-center justify-center">
                    <LogIn className="text-emerald-400" size={22} strokeWidth={2.5} />
                  </div>
                  <div className="text-left">
                    <span className="text-lg">Iniciar Sesión</span>
                    <span className="text-emerald-200 text-sm block">Accede con tu cuenta</span>
                  </div>
                </div>
              </Link>

              {/* Register Button */}
              <Link
                href="/register"
                className="w-full flex items-center justify-between p-5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all active:scale-95 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-600/30 rounded-xl flex items-center justify-center">
                    <UserPlus className="text-emerald-400" size={22} strokeWidth={2.5} />
                  </div>
                  <div className="text-left">
                    <span className="text-lg">Registrarse</span>
                    <span className="text-slate-400 text-sm block">Crea una cuenta nueva</span>
                  </div>
                </div>
              </Link>

              {/* Demo Access Button */}
              <Link
                href="/demo"
                className="w-full flex items-center justify-between p-5 bg-amber-500/10 hover:bg-amber-500/20 border-2 border-amber-500/30 border-dashed rounded-xl transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center group-hover:bg-amber-500/30 transition-colors">
                    <Eye className="text-amber-400" size={22} strokeWidth={2} />
                  </div>
                  <div className="text-left">
                    <span className="text-lg text-amber-400">Ver Demo</span>
                    <span className="text-slate-400 text-sm block">Explora sin registrarse</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            © 2025 IronCore Gym • Sistema de administración multi-tenant
          </p>
        </div>
      </footer>
    </div>
  );
}
