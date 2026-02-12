'use client';

import React from 'react';
import { LayoutDashboard, Users, Calendar, Settings, LogOut, Dumbbell, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  session?: {
    user?: {
      name?: string | null;
      role?: string;
      gymId?: string;
      gymName?: string;
    } | null;
  };
}

const Sidebar: React.FC<SidebarProps> = ({ session }) => {
  const pathname = usePathname();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Users size={20} />, label: 'Miembros', path: '/members' },
    { icon: <Calendar size={20} />, label: 'Horarios', path: '/schedule' },
    { icon: <BarChart3 size={20} />, label: 'Planes', path: '/plans' },
    { icon: <Settings size={20} />, label: 'Configuración', path: '/settings' },
  ];

  const handleSignOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full shrink-0">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="bg-emerald-500 p-2.5 rounded-xl shadow-lg shadow-emerald-500/30">
          <Dumbbell className="text-white" size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            IRON<span className="text-emerald-400">CORE</span>
          </h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest">Gym Management</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname?.startsWith(item.path);
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-500 font-semibold'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <span className={isActive ? 'text-emerald-400' : ''}>{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      {session?.user && (
        <div className="p-4 border-t border-slate-800/50">
          <div className="bg-slate-800/30 p-4 rounded-2xl mb-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Administrador</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-white font-bold">
                {session.user.name?.charAt(0) || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-white truncate">{session.user.name || 'Admin'}</p>
                <p className="text-xs text-slate-500 truncate">{session.user.role || 'ADMIN'}</p>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded-lg text-xs">
              <span className="text-slate-400">Gimnasio</span>
              <span className="text-emerald-400 font-medium">{session.user.gymName || 'Principal'}</span>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 w-full bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all text-sm font-medium"
          >
            <LogOut size={16} strokeWidth={2} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;