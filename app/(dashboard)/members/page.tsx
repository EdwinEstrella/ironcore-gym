'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Search, Filter, MoreHorizontal, Mail, Phone, Calendar, UserPlus, Trash2, Pencil, Eye, Crown } from 'lucide-react';
import Link from 'next/link';

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
    emergency_contact: 'María Mendoza - Wife',
    join_date: '2024-01-15',
    gymName: 'IronCore Gym Centro',
  },
  {
    id: '2',
    first_name: 'Laura',
    last_name: 'García',
    email: 'laura.garcia@email.com',
    status: 'inactive',
    plan: 'Básico',
    plan_expiry: '2025-02-28',
    last_visit: '2025-02-08',
    avatar_url: 'https://api.dicebear.com/7.x/avatars/3e52fc136b?name=Laura',
    phone: '+34 6 234 5678',
    emergency_contact: 'Juan García - Husband',
    join_date: '2024-06-20',
    gymName: 'IronCore Gym Norte',
  },
  {
    id: '3',
    first_name: 'Miguel',
    last_name: 'Ángel',
    email: 'miguel.angel@email.com',
    status: 'active',
    plan: 'Premium',
    plan_expiry: '2025-04-20',
    last_visit: '2025-02-11',
    avatar_url: 'https://api.dicebear.com/7.x/avatars/ac611e7b?seed=Miguel',
    phone: '+34 6 111 2233',
    emergency_contact: 'Ana Torres - Sister',
    join_date: '2023-11-10',
    gymName: 'IronCore Gym Centro',
  },
  {
    id: '4',
    first_name: 'Carmen',
    last_name: 'López',
    email: 'carmen.lopez@email.com',
    status: 'expiring',
    plan: 'Premium',
    plan_expiry: '2025-02-12',
    last_visit: '2025-02-09',
    avatar_url: 'https://api.dicebear.com/7.x/avatars/91a46ad?seed=Carmen',
    phone: '+34 6 456 7890',
    emergency_contact: 'Pedro López - Father',
    join_date: '2024-08-05',
    gymName: 'IronCore Gym Sur',
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
    phone: '+34 6 333 4444',
    emergency_contact: 'Luisa Fernández - Mother',
    join_date: '2023-10-15',
    gymName: 'IronCore Gym Oeste',
  },
];

export default function MembersPage() {
  const { data: session, update } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMember, setSelectedMember] = useState<typeof mockMembers[0] | null>(null);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const filteredMembers = mockMembers.filter(m =>
    statusFilter === 'all' || m.status === statusFilter
  ).filter(m =>
    `${m.first_name} ${m.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <Filter size={18} strokeWidth={2} className="text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            >
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
              <option value="expiring">Por Vencer</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-slate-400">
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
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Vence</th>
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
                      <img
                        src={member.avatar_url}
                        alt={member.first_name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-slate-700"
                      />
                      <div>
                        <p className="font-medium text-white">{member.first_name} {member.last_name}</p>
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
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
                      <Crown className="w-3 h-3 mr-1 text-amber-500" size={12} strokeWidth={2.5} />
                      {member.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-300">{new Date(member.plan_expiry).toLocaleDateString('es-ES')}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-300">{new Date(member.last_visit).toLocaleDateString('es-ES')}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
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

      {/* Member Detail Modal */}
      {selectedMember && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] p-5"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl w-full shadow-2xl animate-in fade-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                  {selectedMember.first_name.charAt(0)}
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

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Avatar & Name */}
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={selectedMember.avatar_url}
                  alt={selectedMember.first_name}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-700"
                />
                <div>
                  <h4 className="text-xl font-bold text-white">{selectedMember.first_name} {selectedMember.last_name}</h4>
                  <p className="text-slate-400 text-sm">{selectedMember.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedMember.status)}`}>
                      {selectedMember.status === 'active' && <Crown className="w-3 h-3 mr-1" size={12} strokeWidth={2.5} />}
                      {getStatusLabel(selectedMember.status)}
                    </span>
                    <span className="text-slate-500 ml-2">{selectedMember.plan}</span>
                  </div>
                </div>
              </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Teléfono</p>
                  <div className="flex items-center gap-2 text-white">
                    <Phone size={16} strokeWidth={2} className="text-slate-400" />
                    {selectedMember.phone}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-400 mb-1">Plan</p>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${selectedMember.plan === 'Premium' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-300'}`}>
                      <Crown className="w-3 h-3 mr-1" size={12} strokeWidth={2.5} />
                      {selectedMember.plan}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-400 mb-1">Estado</p>
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedMember.status)}`}>
                    {selectedMember.status === 'active' && <Crown className="w-3 h-3 mr-1" size={12} strokeWidth={2.5} />}
                    {getStatusLabel(selectedMember.status)}
                  </span>
                  </div>

                <div>
                  <p className="text-sm text-slate-400 mb-1">Vencimiento</p>
                  <p className="text-sm text-white">{new Date(selectedMember.plan_expiry).toLocaleDateString('es-ES')}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-400 mb-1">Última Visita</p>
                  <p className="text-sm text-white">{new Date(selectedMember.last_visit).toLocaleDateString('es-ES')}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-400 mb-1">Gimnasio</p>
                  <p className="text-sm text-white">{selectedMember.gymName || 'Principal'}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-400 mb-1">Fecha Registro</p>
                  <p className="text-sm text-white">{new Date(selectedMember.join_date).toLocaleDateString('es-ES')}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t border-slate-700">
              <button className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl transition-all">
                Cancelar
              </button>
              <button className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20">
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
