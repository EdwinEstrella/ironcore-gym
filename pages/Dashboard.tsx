
import React, { useEffect, useState } from 'react';
import { Users, DollarSign, UserPlus, Timer, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import StatsCard from '../components/StatsCard';
import CapacityGauge from '../components/CapacityGauge';
import InscribirSocioModal from '../src/components/InscribirSocioModal';
import { supabaseService } from '../services/supabaseMock';
import { GymStats, PeakHourData } from '../types';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<GymStats | null>(null);
  const [peakHours, setPeakHours] = useState<PeakHourData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [statsData, peakData] = await Promise.all([
        supabaseService.getGymStats(),
        supabaseService.getPeakHours()
      ]);
      setStats(statsData);
      setPeakHours(peakData);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (!stats) return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-400 font-medium">Sincronizando con Supabase...</p>
      </div>
    </div>
  );

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Panel de Control</h1>
          <p className="text-slate-400 font-medium">Resumen operativo • {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowModal(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 active:scale-95">
            <UserPlus size={18} strokeWidth={2.5} />
            Inscribir Socio
          </button>
        </div>
      </header>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Miembros" 
          value={stats.totalMembers} 
          icon={<Users size={24} />} 
          trend="+5.2%" 
          trendUp={true} 
        />
        <StatsCard 
          title="Ingresos Mensuales" 
          value={`$${stats.monthlyRevenue.toLocaleString()}`} 
          icon={<DollarSign size={24} />} 
          trend="+12%" 
          trendUp={true} 
        />
        <StatsCard 
          title="Nuevos (Mes)" 
          value={stats.newMembersThisMonth} 
          icon={<UserPlus size={24} />} 
          trend="+8%" 
          trendUp={true} 
        />
        <StatsCard 
          title="Sesiones Hoy" 
          value="342" 
          icon={<Activity size={24} />} 
          trend="-2%" 
          trendUp={false} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real-time Capacity - Card structure updated for perfect centering */}
        <div className="lg:col-span-1 bg-slate-800/50 border border-slate-700 p-8 rounded-[2.5rem] flex flex-col min-h-[480px]">
          <div className="w-full flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Timer className="text-emerald-500" size={20} />
              Aforo en Directo
            </h2>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Live</span>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center py-4">
            <CapacityGauge current={stats.activeNow} max={stats.maxCapacity} />
          </div>
        </div>

        {/* Peak Hours Chart */}
        <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 p-8 rounded-[2.5rem] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-white">Análisis de Horarios Pico</h2>
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700">
              <button className="px-3 py-1 text-xs font-bold text-white bg-slate-700 rounded-lg">Hoy</button>
              <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-300">Semana</button>
            </div>
          </div>
          
          <div className="flex-1 min-h-[300px] w-full">
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
                  cursor={{ fill: '#1e293b', radius: 8, opacity: 0.4 }}
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: '1px solid #334155', 
                    borderRadius: '16px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                  }}
                  itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                />
                <Bar 
                  dataKey="count" 
                  radius={[6, 6, 0, 0]}
                  animationDuration={1500}
                >
                  {peakHours.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.count > 80 ? '#f43f5e' : entry.count > 50 ? '#f59e0b' : '#10b981'} 
                      fillOpacity={0.85}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-6 py-4 border-t border-slate-700/30">
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
      <InscribirSocioModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default Dashboard;
