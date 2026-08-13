import React from 'react';

export default function LoadingSpinner({ message = "Loading physics materials..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-[300px]">
      <div className="relative w-28 h-28">
        {/* Outermost pulsing glow ring */}
        <div className="absolute inset-0 rounded-full animate-ping opacity-10"
          style={{ background: 'radial-gradient(circle, #4f75f7, transparent)', animationDuration: '2s' }} />

        {/* Orbital ring 1 */}
        <div className="absolute inset-0 rounded-full border-[1.5px] border-primary-500/15 border-t-primary-500 animate-spin"
          style={{ animationDuration: '1.5s' }} />
        
        {/* Orbital ring 2 */}
        <div className="absolute inset-3 rounded-full border-[1.5px] border-indigo-500/10 border-r-indigo-500 animate-spin"
          style={{ animationDuration: '1.1s', animationDirection: 'reverse' }} />
        
        {/* Orbital ring 3 */}
        <div className="absolute inset-6 rounded-full border-[1.5px] border-violet-400/15 border-b-violet-400 animate-spin"
          style={{ animationDuration: '0.75s' }} />

        {/* Orbiting particle */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary-400 animate-spin"
          style={{ animationDuration: '1.5s', transformOrigin: '0 52px', boxShadow: '0 0 8px rgba(79,117,247,0.8)' }} />

        {/* Center Nucleus */}
        <div className="absolute inset-[42px] rounded-full flex items-center justify-center animate-pulse"
          style={{ background: 'linear-gradient(135deg, #4f75f7, #6366f1)', boxShadow: '0 0 24px 6px rgba(79,117,247,0.3)' }}>
          <span className="text-[9px] font-bold text-white uppercase tracking-widest">e⁻</span>
        </div>
      </div>
      
      {message && (
        <p className="mt-7 text-sm font-semibold text-slate-400 animate-pulse text-center tracking-wide font-display">
          {message}
        </p>
      )}
    </div>
  );
}
