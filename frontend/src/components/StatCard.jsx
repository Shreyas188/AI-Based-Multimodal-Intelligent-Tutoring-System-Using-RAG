import React from 'react';

export default function StatCard({ title, value, icon: Icon, description, trend, colorClass = "from-primary-500 to-indigo-600" }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100/80 transition-all duration-300 group flex items-start justify-between relative overflow-hidden card-hover animate-fade-in-up"
      style={{ boxShadow: '0 2px 12px -4px rgba(15,23,42,0.06)' }}>

      {/* Ambient glow background matching card color */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${colorClass} opacity-[0.04] rounded-bl-full -mr-6 -mt-6 group-hover:opacity-[0.08] transition-opacity duration-300 pointer-events-none`} />

      {/* Shimmer overlay on hover */}
      <div className="absolute inset-0 shimmer-bg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="space-y-3.5 relative z-10">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-display">
          {title}
        </span>
        <div className="space-y-0.5">
          <h3 className="text-2xl font-bold text-slate-800 font-display tracking-tight group-hover:scale-[1.02] transition-transform duration-200 origin-left">
            {value}
          </h3>
          {description && (
            <p className="text-xs text-slate-400 font-medium">{description}</p>
          )}
        </div>

        {trend && (
          <div className="flex items-center gap-1">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              trend.type === 'success'
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                : 'bg-amber-50 text-amber-600 border-amber-100'
            }`}>
              {trend.text}
            </span>
          </div>
        )}
      </div>

      {/* Icon box with glow */}
      <div className={`p-3.5 bg-gradient-to-tr ${colorClass} text-white rounded-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative z-10 shrink-0`}
        style={{ boxShadow: '0 6px 20px -6px rgba(79,117,247,0.35)' }}>
        <Icon className="w-5 h-5 stroke-[2]" />
      </div>
    </div>
  );
}
