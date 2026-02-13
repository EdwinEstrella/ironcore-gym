'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Search, Filter, Mail, Phone, Eye, Pencil, Trash2, Crown, UserPlus, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Datos mock mientras no hay API real
const mockMembers = [
  {
    id: '1',
    first_name: 'Carlos',
    last_name: 'Mendoza',
    email: 'carlos.mendoza@email.com',
    status: 'active',
    plan: 'Premium',
    plan_expiry: '2025-03-15',
    last_visit: '2025-02-10',
    avatar_url: 'https://api.dicebear.com/7.x/avatars/ad5efac2d2b?seed=Carlos',
    phone: '+34 6 123 4567',
    emergency_contact: 'Ana Mendoza - Wife',
    join_date: '2024-08-01',
    gymName: 'IronCore Gym Norte',
  },
  {
    id: '2',
    first_name: 'Laura',
    last_name: 'García',
    email: 'laura.garcia@email.com',
    status: 'active',
    plan: 'VIP',
    plan_expiry: '2025-04-20',
    last_visit: '2025-02-11',
    avatar_url: 'https://api.dicebear.com/7.x/avatars/91a46ad?seed=Laura',
    phone: '+34 6 234 5678',
    emergency_contact: 'José García - Father',
    join_date: '2024-07-15',
    gymName: 'IronCore Gym Sur',
  },
  {
    id: '3',
    first_name: 'Miguel',
    last_name: 'Rodríguez',
    email: 'miguel.rodriguez@email.com',
    status: 'expiring',
    plan: 'Básico',
    plan_expiry: '2025-02-12',
    last_visit: '2025-02-09',
    avatar_url: 'https://api.dicebear.com/7.x/avatars/5361bf?seed=Miguel',
    phone: '+34 6 345 6789',
    emergency_contact: 'María Rodríguez - Mother',
    join_date: '2024-09-10',
    gymName: 'IronCore Gym Principal',
  },
  {
    id: '4',
    first_name: 'Sofía',
    last_name: 'López',
    email: 'sofia.lopez@email.com',
    status: 'inactive',
    plan: 'Premium',
    plan_expiry: '2024-12-31',
    last_visit: '2025-01-15',
    avatar_url: 'https://api.dicebear.com/7.x/avatars/91a46ad?seed=Sofia',
    phone: '+34 6 456 7890',
    emergency_contact: 'Carlos López - Brother',
    join_date: '2024-06-20',
    gymName: 'IronCore Gym Norte',
  },
  {
    id: '5',
    first_name: 'Roberto',
    last_name: 'Fernández',
    email: 'roberto.fernandez@email.com',
    status: 'active',
    plan: 'Básico',
    plan_expiry: '2025-05-01',
    last_visit: '2025-02-10',
    avatar_url: 'https://api.dicebear.com/7.x/avatars/5361bf?seed=Roberto',
    phone: '+34 6 567 8901',
    emergency_contact: 'Laura Fernández - Sister',
    join_date: '2024-10-05',
    gymName: 'IronCore Gym Sur',
  },
];

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
    case 'expiring': return 'Por vencer';
    default: return 'Desconocido';
  }
};

export default function MembersPage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredMembers = mockMembers.filter(member => {
    const matchesSearch = member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (status === 'loading') {
    return <div>Cargando...</div>;
  }

  if (!session?.user) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Acceso Requerido</h2>
          <p className="text-slate-400 mb-8">Debes iniciar sesión para ver los miembros.</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all"
          >
            Ir a Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Miembros</h1>
          <p className="text-slate-400">
            Gestiona los socios del gimnasio
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
          <UserPlus size={18} strokeWidth={2.5} />
          Nuevo Miembro
        </button>
      </header>

      {/* Filters */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} strokeWidth={2} />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={18} strokeWidth={2} className="text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
              <option value="expiring">Por vencer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm font-medium">Miembro</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm font-medium">Contacto</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm font-medium">Plan</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm font-medium">Estado</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm font-medium">Última Visita</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-slate-400 text-sm font-medium">Acciones</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <Image
                        src={member.avatar_url}
                        alt={`${member.first_name} ${member.last_name}`}
                        width={48}
                        height={48}
                        className="rounded-full object-cover border-2 border-slate-700"
                      />
                      <div>
                        <h3 className="font-semibold text-white">
                          {member.first_name} {member.last_name}
                        </h3>
                        <p className="text-slate-400 text-sm">{member.gymName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-white">
                        <Mail size={16} strokeWidth={2} className="text-slate-400" />
                        <span className="text-sm">{member.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white">
                        <Phone size={16} strokeWidth={2} className="text-slate-400" />
                        <span className="text-sm">{member.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                      member.plan === 'Premium' ? 'bg-amber-500/20 text-amber-400' :
                      member.plan === 'VIP' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      {member.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                      {member.status === 'active' && <Crown className="w-3 h-3 mr-1" size={12} strokeWidth={2.5} />}
                      {getStatusLabel(member.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">

                      <span className="text-sm text-white">
                        {new Date(member.last_visit).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-700 rounded-lg transition-colors">
                        <Eye size={16} strokeWidth={2} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition-colors">
                        <Pencil size={16} strokeWidth={2} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-lg transition-colors">
                        <Trash2 size={16} strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-16">
            <Users className="mx-auto h-16 w-16 text-slate-600 mb-4" strokeWidth={1} />
            <p className="text-slate-400">No se encontraron miembros</p>
            <p className="text-slate-500 text-sm">
              {statusFilter === 'all' && 'Intenta con otros filtros o agrega un nuevo miembro'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}