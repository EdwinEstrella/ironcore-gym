'use client';

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, DollarSign, UserPlus, Activity, TrendingUp, Timer, Eye, Search, Filter, MoreHorizontal, Crown, Plus } from "lucide-react";
import Link from "next/link";

interface DemoButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  showToast: () => void;
  title?: string;
}

function DemoButton({ children, className, onClick, showToast }: DemoButtonProps) {
  return (
    <button
      onClick={(e) => { e.preventDefault(); showToast(); onClick?.(); }}
      className={className}
    >
      {children}
    </button>
  );
}

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<typeof demoMembers[number] | null>(null);
  const [toast, setToast] = useState(false);

  const showToast = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  };

  // Datos demo
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

  const demoMembers = [
    { id: 1, name: "Carlos Mendoza", email: "carlos@email.com", plan: "Premium", status: "active", lastVisit: "2025-02-10", phone: "+34 6 123 4567", gymName: "IronCore Gym Centro" },
    { id: 2, name: "Laura García", email: "laura@email.com", plan: "Básico", status: "inactive", lastVisit: "2025-02-08", phone: "+34 6 234 5678", gymName: "IronCore Gym Norte" },
    { id: 3, name: "Miguel Ángel", email: "miguel@email.com", plan: "Premium", status: "active", lastVisit: "2025-02-11", phone: "+34 6 111 2233", gymName: "IronCore Gym Centro" },
    { id: 4, name: "Carmen López", email: "carmen@email.com", plan: "VIP Black", status: "expiring", lastVisit: "2025-02-09", phone: "+34 6 456 7890", gymName: "IronCore Gym Sur" },
    { id: 5, name: "Roberto Fernández", email: "roberto@email.com", plan: "Básico", status: "active", lastVisit: "2025-02-10", phone: "+34 6 333 4444", gymName: "IronCore Gym Oeste" },
    { id: 6, name: "Ana Torres", email: "ana@email.com", plan: "Premium", status: "active", lastVisit: "2025-02-11", phone: "+34 6 555 6666", gymName: "IronCore Gym Centro" },
    { id: 7, name: "Pedro Sánchez", email: "pedro@email.com", plan: "Básico", status: "inactive", lastVisit: "2025-01-30", phone: "+34 6 777 8888", gymName: "IronCore Gym Norte" },
  ];

  const plans = [
    { id: "basic", name: "Básico", price: 29.99, features: ["Acceso al gimnasio", "Equipamiento básico", "Horarios limitados"], popular: false },
    { id: "premium", name: "Premium", price: 49.99, features: ["Todo lo incluido", "Acceso 24/7", "Clases grupales", "Todas las sedes"], popular: true },
    { id: "vip", name: "VIP Black", price: 89.99, features: ["Todo sin límite", "Acceso prioritario", "Entrenador personal", "Areas VIP", "Suplementos"], popular: false },
  ];

  const filteredMembers = demoMembers.filter(m =>
    statusFilter === 'all' || m.status === statusFilter
  ).filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/10 text-emerald-500';
      case 'inactive': return 'bg-slate-500/10 text-slate-500';
      case 'expiring': return 'bg-amber-500/10 text-amber-500';
      default: return 'bg-slate-500/10 text-slate-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'expiring': return 'Por Vencer';
      default: return 'Desconocido';
    }
  };

  const menuItems = [
    { id: 'dashboard', icon: <Activity size={20} />, label: 'Dashboard' },
    { id: 'members', icon: <Users size={20} />, label: 'Miembros' },
    { id: 'plans', icon: <UserPlus size={20} />, label: 'Planes' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 py-2 px-4 text-center sticky top-0 z-50">
        <div className="flex items-center justify-center gap-3">
          <Eye className="text-white" size={16} strokeWidth={2.5} />
          <span className="text-white font-bold uppercase tracking-wider text-xs">
            Modo Demo - Los cambios no se guardan
          </span>
          <span className="text-white/80 text-xs hidden sm:inline">|</span>
          <Link href="/login" className="text-white/90 hover:text-white text-xs underline hidden sm:inline font-medium">
            Inicia sesión para editar
          </Link>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 bg-amber-500 text-white px-4 py-3 rounded-xl shadow-lg z-50 animate-in fade-in slide-in-from-right-4">
          <div className="flex items-center gap-2">
            <Eye size={18} strokeWidth={2.5} />
            <span className="font-medium text-sm">Modo Demo - Acción bloqueada</span>
          </div>
        </div>
      )}

      {/* Sidebar + Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-[calc(100vh-44px)] sticky top-[44px]">
          <div className="p-6 flex items-center gap-3">
            <div className="bg-amber-500 p-2.5 rounded-xl shadow-lg shadow-amber-500/30">
              <span className="text-white text-xl font-bold">IC</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                IRON<span className="text-amber-400">CORE</span>
              </h1>
              <p className="text-xs text-amber-400 uppercase tracking-widest">Demo Mode</p>
            </div>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id
                    ? 'bg-amber-500/10 text-amber-500 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className={activeTab === item.id ? 'text-amber-400' : ''}>{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-800/50">
            <div className="bg-slate-800/30 p-4 rounded-2xl mb-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Administrador</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400 font-bold border-2 border-amber-500/30">
                  D
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-white truncate">Demo Admin</p>
                  <p className="text-xs text-amber-400 truncate">DEMO USER</p>
                </div>
              </div>
            </div>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 px-4 py-3 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all text-sm"
            >
              Iniciar Sesión Real
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                {activeTab === 'dashboard' && 'Panel de Control'}
                {activeTab === 'members' && 'Miembros'}
                {activeTab === 'plans' && 'Planes de Membresía'}
              </h1>
              <p className="text-slate-400">
                Vista previa del sistema • <span className="text-amber-400">Modo Demo</span>
              </p>
            </div>
            <div className="flex gap-2">
              <DemoButton
                showToast={showToast}
                onClick={() => setShowModal(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 active:scale-95"
              >
                <UserPlus size={18} strokeWidth={2.5} />
                {activeTab === 'members' ? 'Nuevo Miembro' : 'Inscribir Socio'}
              </DemoButton>
            </div>
          </header>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                {/* Capacity */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Timer className="text-emerald-500" size={20} strokeWidth={2.5} />
                      Aforo en Directo
                    </h2>
                    <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20">
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">DEMO</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center py-6">
                    <svg className="w-48 h-48" viewBox="0 0 200 120">
                      <circle cx="100" cy="60" r="50" fill="none" stroke="#1e293b" strokeWidth="12" strokeDasharray="257" />
                      <circle
                        cx="100"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="12"
                        strokeDasharray="257"
                        strokeDashoffset={257 - (257 * stats.activeNow / stats.maxCapacity)}
                        transform="rotate(-90 100 60)"
                        strokeLinecap="round"
                      />
                      <text x="100" y="60" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold" fill="#f59e0b">
                        {stats.activeNow}
                      </text>
                      <text x="100" y="110" textAnchor="middle" className="text-sm font-semibold" fill="#94a3b8">
                        {stats.activeNow}%
                      </text>
                    </svg>
                  </div>

                  <div className="text-center mt-4">
                    <p className="text-slate-400 text-sm">
                      <span className="text-white font-semibold">{stats.activeNow}</span> personas en el gym
                    </p>
                    <p className="text-slate-500 text-xs mt-1">
                      Límite <span className="text-white">{stats.maxCapacity}</span>
                    </p>
                  </div>
                </div>

                {/* Peak Hours */}
                <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
                  <h2 className="text-lg font-bold text-white mb-6">Análisis de Horarios Pico</h2>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={peakHours}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.5} />
                        <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                        <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                        <Tooltip
                          cursor={{ fill: "#1e293b", radius: 8, opacity: 0.4 }}
                          contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "16px" }}
                          itemStyle={{ color: "#f59e0b", fontWeight: "bold" }}
                        />
                        <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#f59e0b" fillOpacity={0.85} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Members Tab */}
          {activeTab === 'members' && (
            <>
              {/* Filters */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} strokeWidth={2} />
                    <input
                      type="text"
                      placeholder="Buscar por nombre o email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Filter size={18} strokeWidth={2} className="text-slate-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                    >
                      <option value="all">Todos</option>
                      <option value="active">Activos</option>
                      <option value="inactive">Inactivos</option>
                      <option value="expiring">Por Vencer</option>
                    </select>
                  </div>
                </div>
                <div className="text-sm text-slate-400 mt-2">
                  {filteredMembers.length} miembro{filteredMembers.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Members Table */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Miembro</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Estado</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Plan</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Última Visita</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {filteredMembers.map((member) => (
                        <tr
                          key={member.id}
                          className="hover:bg-slate-700/30 transition-colors group cursor-pointer"
                          onClick={() => setSelectedMember(member)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-white font-bold">
                                {member.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-white">{member.name}</p>
                                <p className="text-xs text-slate-500">{member.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                              {member.status === 'active' && <Crown className="w-3 h-3 mr-1" size={12} strokeWidth={2.5} />}
                              {getStatusLabel(member.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                              member.plan === 'VIP Black' ? 'bg-amber-500/10 text-amber-400' :
                              member.plan === 'Premium' ? 'bg-emerald-500/10 text-emerald-400' :
                              'bg-slate-700 text-slate-300'
                            }`}>
                              <Crown className="w-3 h-3 mr-1" size={12} strokeWidth={2.5} />
                              {member.plan}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-slate-300">{member.lastVisit}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <DemoButton showToast={showToast} className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-700 rounded-lg transition-colors" title="Ver (Demo)">
                                <Eye size={16} strokeWidth={2} />
                              </DemoButton>
                              <DemoButton showToast={showToast} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition-colors" title="Editar (Demo)">
                                <MoreHorizontal size={16} strokeWidth={2} />
                              </DemoButton>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Plans Tab */}
          {activeTab === 'plans' && (
            <>
              {/* Billing Toggle */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center gap-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-2">
                  <button className="px-6 py-3 rounded-xl transition-all bg-amber-500 text-white font-bold">
                    Mensual
                  </button>
                  <button className="px-6 py-3 rounded-xl transition-all text-slate-400 hover:text-white">
                    Anual <span className="text-xs text-slate-500 ml-2">(Ahorra 17%)</span>
                  </button>
                </div>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="bg-slate-800/50 border border-slate-700 hover:border-amber-500 rounded-2xl p-8 transition-all duration-200"
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 right-6 bg-amber-500 px-3 py-1 rounded-full text-xs font-bold text-white">
                        Popular
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-2xl ${
                          plan.id === 'vip' ? 'bg-amber-500/20' : plan.id === 'premium' ? 'bg-emerald-500/20' : 'bg-slate-700/50'
                        }`}>
                          {plan.id === 'basic' && <Users className="text-slate-400" size={32} strokeWidth={2} />}
                          {plan.id === 'premium' && <Crown className="text-emerald-400" size={32} strokeWidth={2.5} />}
                          {plan.id === 'vip' && <Crown className="text-amber-400" size={32} strokeWidth={2.5} />}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                          <p className="text-sm text-slate-400">Plan {plan.id.toUpperCase()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-white">${plan.price}</div>
                        <p className="text-xs text-slate-400">/mes</p>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          </div>
                          <span className="text-sm text-slate-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <DemoButton showToast={showToast} className="w-full py-4 rounded-xl font-bold transition-all bg-slate-700 hover:bg-slate-600 text-white">
                      Seleccionar Plan
                    </DemoButton>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Inscribir Socio Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] p-5"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <UserPlus className="text-amber-500" size={20} strokeWidth={2.5} />
                </div>
                <h2 className="text-xl font-bold text-white">Inscribir Nuevo Socio</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 text-amber-300 text-sm">
                  <Eye size={16} strokeWidth={2} />
                  <span className="font-medium">Modo Demo</span>
                </div>
                <p className="text-slate-300 text-sm mt-2">Esta función está deshabilitada en modo demo. Inicia sesión para inscribir socios reales.</p>
              </div>

              <div className="space-y-4 opacity-50 pointer-events-none">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Gimnasio</label>
                  <select className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-500">
                    <option>-- Selecciona un gimnasio --</option>
                    <option>Gym Madrid</option>
                    <option>Gym Barcelona</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Nombre completo</label>
                  <input type="text" placeholder="Juan Pérez" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-500" disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                  <input type="email" placeholder="juan@email.com" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-500" disabled />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-5 py-2.5 text-slate-300 hover:text-white font-medium hover:bg-slate-700 rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <Link
                  href="/login"
                  className="flex-1 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all text-center"
                >
                  Iniciar Sesión
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Member Detail Modal */}
      {selectedMember && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] p-5"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                  {selectedMember.name.charAt(0)}
                </div>
                <span>Detalles del Miembro</span>
              </h3>
              <button
                onClick={() => setSelectedMember(null)}
                className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-24 h-24 bg-slate-700 rounded-2xl flex items-center justify-center text-4xl text-white font-bold">
                  {selectedMember.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">{selectedMember.name}</h4>
                  <p className="text-slate-400 text-sm">{selectedMember.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedMember.status)}`}>
                      {getStatusLabel(selectedMember.status)}
                    </span>
                    <span className="text-slate-500 ml-2">{selectedMember.plan}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Teléfono</p>
                  <p className="text-sm text-white">{selectedMember.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Gimnasio</p>
                  <p className="text-sm text-white">{selectedMember.gymName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Vencimiento</p>
                  <p className="text-sm text-white">{selectedMember.lastVisit}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Estado</p>
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedMember.status)}`}>
                    {getStatusLabel(selectedMember.status)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-slate-700 p-6">
              <button
                onClick={() => setSelectedMember(null)}
                className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl transition-all"
              >
                Cerrar
              </button>
              <DemoButton showToast={showToast} className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl transition-all">
                Editar (Demo)
              </DemoButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
