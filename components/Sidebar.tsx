
import React from 'react';
import { LayoutDashboard, Users, Calendar, Settings, LogOut, Dumbbell } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <Users size={20} />, label: 'Miembros', path: '/members' },
    { icon: <Calendar size={20} />, label: 'Horarios', path: '/schedule' },
    { icon: <Settings size={20} />, label: 'Configuración', path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-emerald-500 p-2 rounded-lg shadow-lg shadow-emerald-500/20">
          <Dumbbell className="text-white" size={24} />
        </div>
        <span className="text-xl font-bold tracking-tight text-white uppercase">IRON<span className="text-emerald-500">CORE</span></span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              location.pathname === item.path
                ? 'bg-emerald-500/10 text-emerald-500 font-semibold'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
            }`}
          >
            <span className={`${location.pathname === item.path ? 'text-emerald-500' : 'text-slate-400 group-hover:text-white'}`}>
              {item.icon}
            </span>
            <span className="text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800/50">
        <div className="bg-slate-800/30 p-4 rounded-2xl mb-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Administrador</p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-xs">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">Admin Gym</p>
              <p className="text-[10px] text-slate-500 truncate">Soporte IronCore</p>
            </div>
          </div>
        </div>
        <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all text-sm font-medium">
          <LogOut size={18} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
