
import React from 'react';

interface CapacityGaugeProps {
  current: number;
  max: number;
}

const CapacityGauge: React.FC<CapacityGaugeProps> = ({ current, max }) => {
  const percentage = Math.round((current / max) * 100);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = (pct: number) => {
    if (pct < 60) return '#10b981'; // emerald-500
    if (pct < 85) return '#f59e0b'; // amber-500
    return '#f43f5e'; // rose-500
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="relative w-56 h-56 flex items-center justify-center">
        {/* SVG con viewBox para escalado y centrado perfecto */}
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          {/* Círculo de fondo (track) */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-700/50"
          />
          {/* Círculo de progreso */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={getColor(percentage)}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Texto centrado en el medio del círculo */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none translate-y-1">
          <span className="text-6xl font-black text-white leading-none tracking-tighter">
            {current}
          </span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-2 ml-1">
            En el Gym
          </span>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-full flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse`} style={{ backgroundColor: getColor(percentage) }}></div>
            <span className="text-white font-bold text-sm">{percentage}%</span>
          </div>
          <span className="text-slate-500 text-sm font-medium">Límite {max}</span>
        </div>
        <p className="text-slate-400 text-xs font-medium max-w-[180px] mx-auto leading-relaxed">
          {percentage > 90 ? 'Aforo crítico. Se recomienda restringir acceso.' : 
           percentage > 70 ? 'Nivel alto de concurrencia.' : 
           'Flujo de personas en nivel óptimo.'}
        </p>
      </div>
    </div>
  );
};

export default CapacityGauge;
