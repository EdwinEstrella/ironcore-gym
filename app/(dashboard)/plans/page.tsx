'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Crown, Plus, Check, X, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

// Datos mock mientras no hay API real
const plans = [
  {
    id: 'basic',
    name: 'Básico',
    price: 29,
    period: 'mensual',
    features: [
      'Acceso a las instalaciones',
      'Uso de equipos básicos',
      'Locker y ducha',
      'Entrenamiento grupal'
    ],
    popular: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 49,
    period: 'mensual',
    features: [
      'Todo del plan Básico',
      'Acceso a clases especializadas',
      'Entrenador personal 1 sesión/mes',
      'Nutricionista 1 consulta/trimestre',
      'Prioridad en reservas'
    ],
    popular: true,
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 99,
    period: 'mensual',
    features: [
      'Todo del plan Premium',
      'Acceso exclusivo a VIP area',
      'Entrenador personal ilimitado',
      'Nutricionista mensual',
      'Masajes semanales',
      'Parking exclusivo',
      'Eventos exclusivos'
    ],
    popular: false,
  },
];

const formatPrice = (price: number, period: string) => {
  if (period === 'anual') {
    const monthlyPrice = Math.round(price / 12);
    return `€${monthlyPrice}/mes (€${price}/año)`;
  }
  return `€${price}/${period === 'mensual' ? 'mes' : 'año'}`;
};

export default function PlansPage() {
  const { data: session, status } = useSession();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  if (status === 'loading') {
    return <div>Cargando...</div>;
  }

  if (!session?.user) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Acceso Requerido</h2>
          <p className="text-slate-400 mb-8">Debes iniciar sesión para ver los planes.</p>
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

  const savings = billingPeriod === 'yearly' ? 17 : 0;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white tracking-tight mb-4">Elige tu Plan</h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Encuentra el plan perfecto que se adapte a tus objetivos y presupuesto
        </p>
      </header>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-12">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-1 inline-flex">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              billingPeriod === 'monthly'
                ? 'bg-white text-slate-900 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Mensual
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              billingPeriod === 'yearly'
                ? 'bg-white text-slate-900 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Anual
            {savings > 0 && (
              <span className="ml-2 px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
                Ahorras {savings}%
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const isPopular = plan.popular;

          return (
            <div
              key={plan.id}
              className={`relative bg-slate-800/50 border rounded-2xl p-8 transition-all hover:border-slate-600 ${
                isSelected ? 'ring-2 ring-emerald-500 border-emerald-500/50' : 'border-slate-700/50'
              } ${isPopular ? 'border-emerald-500/30' : ''}`}
            >
              {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 bg-emerald-500 text-white text-sm font-bold rounded-full">
                    MÁS POPULAR
                  </span>
                </div>
              )}

              <div className="text-center">
                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>

                {/* Price */}
                <div className="mb-8">
                  <div className="text-4xl font-bold text-white mb-2">
                    {formatPrice(plan.price, billingPeriod === 'monthly' ? 'mensual' : 'anual')}
                  </div>
                  {billingPeriod === 'yearly' && plan.id === 'basic' && (
                    <div className="text-slate-500 text-sm">-</div>
                  )}
                  <p className={`text-xs ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`}>
                    {billingPeriod === 'yearly' ? '/año' : 'mes'}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className={`flex-shrink-0 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} size={20} strokeWidth={2.5} />
                      <span className={`text-sm ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Select Button */}
                <button
                  className={`w-full py-4 rounded-xl font-bold transition-all ${
                    isSelected
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-700 hover:bg-slate-600 text-white'
                  }`}
                >
                  {isSelected ? (
                    <span className="flex items-center justify-center gap-2">
                      Seleccionado
                      <Check size={20} strokeWidth={2.5} />
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {plan.id === 'basic' ? 'Seleccionar' : 'Comparar'}
                      <Plus size={20} strokeWidth={2.5} />
                    </span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto mt-16">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Preguntas Frecuentes</h2>
        <div className="space-y-6">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <h3 className="font-semibold text-white mb-2">¿Puedo cambiar de plan en cualquier momento?</h3>
            <p className="text-slate-400">Sí, puedes cambiar de plan cuando quieras. Los cambios se aplicarán desde el próximo ciclo de facturación.</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <h3 className="font-semibold text-white mb-2">¿Qué pasa si cancelo mi suscripción?</h3>
            <p className="text-slate-400">Podrás continuar usando tu plan hasta el final de tu período de facturación actual. Después de eso, tu acceso se desactivará.</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <h3 className="font-semibold text-white mb-2">¿El plan anual incluye algún beneficio extra?</h3>
            <p className="text-slate-400">Sí, al elegir el plan anual ahorraras un 17% en comparación con pagar mensualmente.</p>
          </div>
        </div>
      </div>
    </div>
  );
}