'use client';

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Users, DollarSign, UserPlus, Timer, Activity, LogOut, LogIn, Settings, Calendar, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useState } from "react";

export default function DashboardPage() {
  const { data: session, update } = useSession();
  const [showModal, setShowModal] = useState(false);

  // Datos demo mientras no haya API real
  const stats = {
    totalMembers: 1240,
    monthlyRevenue: 34500,
    newMembersThisMonth: 124,
    activeNow: 42,
    maxCapacity: 100,
  };

  const peakHours = [
    { hour: "06:00", count: 15 },
    { hour: "07:00", count: 25 },
    { hour: "08:00", count: 45 },
    { hour: "09:00", count: 65 },
    { hour: "10:00", count: 85 },
    { hour: "11:00", count: 95 },
    { hour: "12:00", count: 88 },
    { hour: "13:00", count: 75 },
    { hour: "14:00", count: 60 },
    { hour: "15:00", count: 50 },
    { hour: "16:00", count: 65 },
    { hour: "17:00", count: 85 },
    { hour: "18:00", count: 92 },
    { hour: "19:00", count: 78 },
    { hour: "20:00", count: 55 },
    { hour: "21:00", count: 35 },
    { hour: "22:00", count: 20 },
  ];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  if (!session?.user?.gymId) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Acceso Requerido</h2>
          <p className="text-slate-400 mb-8">Debes iniciar sesión para acceder al dashboard</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all"
          >
            <LogIn size={20} strokeWidth={2.5} />
            Ir a Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Panel de Control</h1>
          <p className="text-slate-400">
            Resumen operativo • {new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 active:scale-95"
          >
            <UserPlus size={18} strokeWidth={2.5} />
            Inscribir Socio
          </button>
        </div>
      </header>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Miembros</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.totalMembers}</p>
            </div>
            <div className="bg-emerald-500/20 p-3 rounded-lg">
              <TrendingUp className="text-emerald-400" size={20} strokeWidth={2.5} />
            </div>
          </div>
          <p className="text-emerald-400 text-sm mt-2">+5.2%</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Ingresos Mensuales</p>
              <p className="text-3xl font-bold text-white mt-1">${stats.monthlyRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <DollarSign className="text-blue-400" size={20} strokeWidth={2.5} />
            </div>
          </div>
          <p className="text-blue-400 text-sm mt-2">+12%</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Nuevos (Mes)</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.newMembersThisMonth}</p>
            </div>
            <div className="bg-emerald-500/20 p-3 rounded-lg">
              <UserPlus className="text-emerald-400" size={20} strokeWidth={2.5} />
            </div>
          </div>
          <p className="text-emerald-400 text-sm mt-2">+8%</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Sesiones Hoy</p>
              <p className="text-3xl font-bold text-white mt-1">342</p>
            </div>
            <div className="bg-rose-500/20 p-3 rounded-lg">
              <Activity className="text-rose-400" size={20} strokeWidth={2.5} />
            </div>
          </div>
          <p className="text-rose-400 text-sm mt-2">-2%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real-time Capacity */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Timer className="text-emerald-500" size={20} strokeWidth={2.5} />
              Aforo en Directo
            </h2>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Live</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center py-6">
            <div className="relative">
              <svg className="w-48 h-48" viewBox="0 0 200 120">
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
                  </linearGradient>
                  <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset={`${(stats.activeNow / stats.maxCapacity) * 100}%`} stopColor="#f43f5e" />
                  </linearGradient>
                </defs>

                {/* Background arc (80% filled) */}
                <circle
                  cx="100"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="12"
                  strokeDasharray="257"
                />

                {/* Value arc */}
                <circle
                  cx="100"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="url(#arcGradient)"
                  strokeWidth="12"
                  strokeDasharray="257"
                  strokeDashoffset={257 - (257 * (stats.activeNow / stats.maxCapacity))}
                  transform="rotate(-90 100 60)"
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />

                {/* Center value */}
                <text
                  x="100"
                  y="60"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-3xl font-bold"
                  fill={stats.activeNow / stats.maxCapacity > 0.8 ? "#f43f5e" : "#10b981"}
                >
                  {stats.activeNow}
                </text>

                {/* Percentage */}
                <text
                  x="100"
                  y="110"
                  textAnchor="middle"
                  className="text-sm font-semibold"
                  fill="#94a3b8"
                >
                  {stats.activeNow}%
                </text>
              </svg>
            </div>
          </div>

          <div className="text-center mt-4">
            <p className="text-slate-400 text-sm">
              <span className="text-white font-semibold">{stats.activeNow}</span> personas en el gym
            </p>
            <p className="text-slate-500 text-xs mt-1">
              Límite <span className="text-white">{stats.maxCapacity}</span>
            </p>
            {stats.activeNow / stats.maxCapacity < 0.5 && (
              <p className="text-emerald-400 text-sm mt-2">
                Flujo de personas en nivel óptimo.
              </p>
            )}
          </div>
        </div>

        {/* Peak Hours Chart */}
        <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Análisis de Horarios Pico</h2>
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700">
              <button className="px-3 py-1 text-xs font-bold text-white bg-slate-700 rounded-lg">Hoy</button>
              <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-300 rounded-lg">Semana</button>
            </div>
          </div>

          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHours}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.5} />
                <XAxis
                  dataKey="hour"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                />
                <Tooltip
                  cursor={{ fill: "#1e293b", radius: 8, opacity: 0.4 }}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "16px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                  }}
                  itemStyle={{ color: "#10b981", fontWeight: "bold" }}
                />
                <Bar
                  dataKey="count"
                  radius={[6, 6, 0, 0]}
                  animationDuration={1500}
                >
                  {peakHours.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.count > 80 ? "#f43f5e" : entry.count > 50 ? "#f59e0b" : "#10b981"}
                      fillOpacity={0.85}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4 py-3 border-t border-slate-700/30">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]"></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Baja</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]"></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Media</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.3)]"></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pico</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Inscripción */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] p-5"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full shadow-2xl animate-in fade-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <UserPlus className="text-emerald-500" size={20} strokeWidth={2.5} />
                </div>
                <h2 className="text-xl font-bold text-white">Inscribir Nuevo Socio</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <p className="text-slate-400 mb-6">
                Completa los datos para registrar un nuevo socio en el gimnasio.
              </p>

              <form onSubmit={(e) => { e.preventDefault(); alert("Funcionalidad de inscripción próximamente disponible"); setShowModal(false); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Selecciona Gimnasio
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  >
                    <option value="">-- Selecciona un gimnasio --</option>
                    <option value="gym-madrid">Gym Madrid</option>
                    <option value="gym-barcelona">Gym Barcelona</option>
                    <option value="gym-sevilla">Gym Sevilla</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Juan Pérez"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="juan@email.com"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 text-slate-300 hover:text-white font-medium hover:bg-slate-700 rounded-xl transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-2"
                  >
                    <UserPlus size={16} strokeWidth={2.5} />
                    Inscribir Socio
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}