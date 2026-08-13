import React from 'react';
import { Home, BookOpen, BarChart2, LogOut, GraduationCap, X } from 'lucide-react';

export default function Sidebar({ activePage, setActivePage, isMobileOpen, setMobileOpen, onLogout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'chapters', label: 'Chapters', icon: BookOpen },
    { id: 'progress', label: 'My Progress', icon: BarChart2 },
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileOpen(false);
  };

  const navContent = (
    <div className="flex flex-col h-full text-white relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0f172a 0%, #0f172a 60%, #111827 100%)' }}>
      
      {/* Ambient glow orbs */}
      <div className="absolute top-0 left-0 w-48 h-48 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(79,117,247,0.08) 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)' }} />

      {/* Brand logo header */}
      <div className="h-16 flex items-center justify-between px-5 relative z-10" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #4f75f7, #6366f1)' }}>
            <GraduationCap className="w-4 h-4 text-white relative z-10" />
            <div className="absolute inset-0 shimmer-bg opacity-30" />
          </div>
          <div className="text-left leading-none">
            <h2 className="text-sm font-bold font-display tracking-tight text-white uppercase">Physics Tutor</h2>
            <span className="text-[9px] font-semibold tracking-wider uppercase" style={{ color: 'rgba(148,163,184,0.7)' }}>Offline Prep App</span>
          </div>
        </div>
        <button 
          onClick={() => setMobileOpen(false)}
          className="p-1 rounded-md md:hidden transition-colors"
          style={{ color: 'rgba(148,163,184,0.7)' }}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav items list */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto relative z-10">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id || (item.id === 'chapters' && activePage === 'study');
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group relative ${
                isActive ? 'nav-active-glow text-white' : 'text-slate-400 hover:text-white'
              }`}
              style={isActive ? {
                background: 'linear-gradient(135deg, rgba(79,117,247,0.2) 0%, rgba(99,102,241,0.12) 100%)',
                border: '1px solid rgba(79,117,247,0.2)',
              } : { background: 'transparent', border: '1px solid transparent' }}
            >
              <Icon className={`w-4 h-4 transition-all duration-200 ${isActive ? 'text-primary-400 scale-110' : 'group-hover:scale-110 group-hover:text-white'}`} />
              <span className={isActive ? 'gradient-text font-bold' : ''}>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400" style={{ boxShadow: '0 0 6px rgba(79,117,247,0.9)' }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer session actions */}
      <div className="p-3 relative z-10" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.2)' }}>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group text-slate-400 hover:text-red-400"
          style={{ border: '1px solid transparent' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.12)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
        >
          <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Log Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 h-screen sticky top-0 flex-shrink-0 z-20" style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        {navContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div 
        className={`fixed top-0 bottom-0 left-0 w-64 z-50 md:hidden transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {navContent}
      </div>
    </>
  );
}
