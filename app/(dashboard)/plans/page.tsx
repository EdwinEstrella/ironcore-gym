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
    price: 29.99,
    billing: 'mensual',
    features: ['Acceso al gimnasio', 'Uso de equipamiento básico', 'Horarios limitados'],
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 49.99,
    billing: 'mensual',
    features: ['Todo lo incluido', 'Acceso 24/7', 'Clases grupales incluidas', 'Acceso a todas las sedes'],
    popular: true,
  },
  {
    id: 'vip',
    name: 'VIP Black',
    price: 89.99,
    billing: 'mensual',
    features: ['Todo sin límite', 'Acceso prioritario', 'Entrenador personal', 'Acceso VIP areas', 'Suplementos incluidos'],
    popular: false,
  },
];

export default function PlansPage() {
  const { data: session } = useSession();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0]['id'] | null>(null);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  if (!session?.user) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Acceso Requerido</h2>
          <p className="text-slate-400 mb-8">Debes iniciar sesión para ver los planes disponibles.</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  const getPrice = (plan: typeof plans[0]) => {
    const price = billingPeriod === 'yearly'
      ? Math.round(plan.price * 12 * 0.9)
      : plan.price;
    return price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
  };

  const getSavings = (plan: typeof plans[0]) => {
    if (plan.id === 'basic') return 0;
    const yearlyPrice = Math.round(plan.price * 12);
    const yearlyBasic = Math.round(plans[0].price * 12);
    return Math.round((yearlyBasic - yearlyPrice) * 100 / yearlyBasic);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Planes de Membresía</h1>
          <p className="text-slate-400">
            Selecciona el plan que mejor se adapte a tus necesidades
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl transition-all"
          >
            Salir
          </button>
        </div>
      </header>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center gap-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-2">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-6 py-3 rounded-xl transition-all ${
              billingPeriod === 'monthly'
                ? 'bg-emerald-500 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Mensual
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={`px-6 py-3 rounded-xl transition-all ${
              billingPeriod === 'yearly'
                ? 'bg-emerald-500 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Anual <span className="text-xs text-slate-500 ml-2">(Ahorra 17%)</span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const savings = getSavings(plan);

          return (
            <div
              key={plan.id}
              className={`relative bg-slate-800/50 border-2xl rounded-3xl p-8 transition-all duration-200 ${
                isSelected
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-2xl shadow-emerald-500/10'
                  : 'border-slate-700 hover:border-slate-600'
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 -right-3 bg-amber-500 px-3 py-1 rounded-full text-xs font-bold text-white">
                  Popular
                </div>
              )}

              {/* Plan Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl transition-all ${
                    isSelected
                      ? 'bg-emerald-500/20'
                      : plan.id === 'vip' ? 'bg-slate-700' : 'bg-slate-700/50'
                  }`}>
                    {plan.id === 'basic' && (
                      <Users className="text-slate-400" size={32} strokeWidth={2} />
                    )}
                    {plan.id === 'premium' && (
                      <Crown className="text-emerald-400" size={32} strokeWidth={2.5} />
                    )}
                    {plan.id === 'vip' && (
                      <Crown className="text-amber-400" size={32} strokeWidth={2.5} />
                    )}
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                      {plan.name}
                    </h3>
                    <p className={`text-sm ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`}>
                      Plan {plan.id.toUpperCase()}
                    </p>
                  </div>
                </div>

                {/* Price & Billing */}
                <div className="text-right">
                  <div className={`text-3xl font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {getPrice(plan)}
                  </div>
                  {billingPeriod === 'yearly' && savings > 0 && plan.id !== 'basic' && (
                    <div className="text-xs text-emerald-400 mt-1">
                      Ahorras {savings}%
                    </div>
                  )}
                  {plan.id === 'basic' && billingPeriod === 'monthly' && (
                    <div className="text-slate-500 text-sm">-</div>
                  )}
                  <p className={`text-xs ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`}>
                    {billingPeriod === 'yearly' ? '/año' : 'mes'}
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4">
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

            {/* Selected Plan Detail Modal */}
            {isSelected && selectedPlan === plan.id && (
                <div className="mt-6 p-6 bg-slate-700/50 border border-slate-700 rounded-2xl">
                  <button
                    onClick={() => setSelectedPlan(null)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white p-2"
                  >
                    <X size={24} strokeWidth={2} />
                  </button>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-4 rounded-2xl ${
                      plan.id === 'vip' ? 'bg-amber-500/20' : plan.id === 'premium' ? 'bg-emerald-500/20' : 'bg-slate-700/50'
                    }`}>
                      <div className="flex items-center gap-4 mb-4">
                        {plan.id === 'vip' && (
                          <Crown className="text-amber-400" size={48} strokeWidth={2.5} />
                        )}
                        {plan.id === 'premium' && (
                          <Crown className="text-emerald-400" size={48} strokeWidth={2.5} />
                        )}
                        {plan.id === 'basic' && (
                          <Users className="text-slate-400" size={48} strokeWidth={2} />
                        )}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                        <p className={`text-4xl font-bold ${plan.id === 'vip' ? 'text-amber-400' : plan.id === 'premium' ? 'text-emerald-400' : 'text-slate-300'}`}>
                          {getPrice(plan)}
                        </p>
                        <p className={`text-sm ${plan.id === 'vip' ? 'text-amber-200' : plan.id === 'premium' ? 'text-emerald-200' : 'text-slate-400'}`}>
                          {billingPeriod === 'yearly' ? 'por año' : 'por mes'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6 flex-1">
                      <h4 className="text-sm font-semibold text-slate-300 mb-4">Incluye:</h4>
                      <ul className="space-y-3">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <Check className="text-emerald-400" size={18} strokeWidth={2.5} />
                            <span className="text-sm text-slate-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20">
                      Elegir Plan {plan.name}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upgrade CTA */}
      {selectedPlan && (
        <div className="mt-12 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/30 rounded-2xl p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Check className="text-emerald-400" size={32} strokeWidth={2.5} />
            <span className="text-white">
              Excelente elección El plan <span className="font-bold">{plans.find(p => p.id === selectedPlan)?.name}</span> te dará acceso a todas las funcionalidades.
            </span>
          </div>
          <Link
            href="/members"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-600 hover:bg-emerald-700 font-bold rounded-xl transition-all shadow-lg"
          >
            Ir a Miembros
            <Users className="text-white" size={20} strokeWidth={2.5} />
          </Link>
        </div>
      )}
    </div>
  );
}