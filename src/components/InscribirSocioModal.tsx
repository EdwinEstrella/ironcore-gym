'use client';

import { useState } from 'react';
import { X, UserPlus } from 'lucide-react';

interface InscribirSocioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InscribirSocioModal({ isOpen, onClose }: InscribirSocioModalProps) {
  const [gymSeleccionado, setGymSeleccionado] = useState('');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de inscripción
    alert('Funcionalidad de inscripción próximamente disponible');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] p-5"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full shadow-2xl animate-in fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <UserPlus className="text-emerald-500" size={20} strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-bold text-white">Inscribir Nuevo Socio</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700 rounded-lg"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-400 mb-6">
            Completa los datos para registrar un nuevo socio en el gimnasio.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Selecciona Gimnasio
              </label>
              <select
                value={gymSeleccionado}
                onChange={(e) => setGymSeleccionado(e.target.value)}
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
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="juan@email.com"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
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
  );
}