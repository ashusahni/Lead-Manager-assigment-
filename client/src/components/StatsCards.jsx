import React from 'react';
import { Users, Sparkles, PhoneCall, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';

export default function StatsCards({ stats, selectedStatus, onSelectStatus }) {
  const cards = [
    {
      id: 'All',
      title: 'Total Leads',
      count: stats?.total ?? 0,
      icon: Users,
      color: 'text-slate-700',
      bg: 'bg-white',
      border: 'border-slate-200',
      activeRing: 'ring-2 ring-slate-800',
    },
    {
      id: 'New',
      title: 'New',
      count: stats?.byStatus?.New ?? 0,
      icon: Sparkles,
      color: 'text-blue-600',
      bg: 'bg-blue-50/50',
      border: 'border-blue-200',
      activeRing: 'ring-2 ring-blue-500',
    },
    {
      id: 'Contacted',
      title: 'Contacted',
      count: stats?.byStatus?.Contacted ?? 0,
      icon: PhoneCall,
      color: 'text-amber-600',
      bg: 'bg-amber-50/50',
      border: 'border-amber-200',
      activeRing: 'ring-2 ring-amber-500',
    },
    {
      id: 'Qualified',
      title: 'Qualified',
      count: stats?.byStatus?.Qualified ?? 0,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50/50',
      border: 'border-emerald-200',
      activeRing: 'ring-2 ring-emerald-500',
    },
    {
      id: 'Lost',
      title: 'Lost',
      count: stats?.byStatus?.Lost ?? 0,
      icon: XCircle,
      color: 'text-rose-600',
      bg: 'bg-rose-50/50',
      border: 'border-rose-200',
      activeRing: 'ring-2 ring-rose-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = selectedStatus === card.id;

        return (
          <button
            key={card.id}
            onClick={() => onSelectStatus(card.id)}
            className={`text-left p-4 rounded-xl border bg-white transition-all shadow-xs hover:shadow-md cursor-pointer ${
              card.border
            } ${isSelected ? `${card.activeRing} shadow-sm` : 'hover:border-slate-300'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">{card.title}</span>
              <div className={`p-1.5 rounded-lg ${card.bg}`}>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {card.count}
            </div>
          </button>
        );
      })}

      {/* Conversion Rate Card */}
      <div className="p-4 rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50/60 to-purple-50/40 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-indigo-700">Win Rate</span>
          <div className="p-1.5 rounded-lg bg-indigo-100/70">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
        </div>
        <div className="text-2xl font-bold text-indigo-950 tracking-tight">
          {stats?.conversionRate ?? 0}%
        </div>
      </div>
    </div>
  );
}
