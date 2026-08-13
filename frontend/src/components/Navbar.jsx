import React, { useState } from 'react';
import { User, LogOut, GraduationCap, Menu } from 'lucide-react';
import StudentProfileModal from './StudentProfileModal';

export default function Navbar({ 
  student, 
  progressData, 
  activePage, 
  onLogout, 
  toggleMobileSidebar,
  onNavigateProgress 
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard': return 'Student Dashboard';
      case 'chapters':  return 'Course Chapters';
      case 'study':     return 'Learning Workspace';
      case 'progress':  return 'Performance & Progress';
      default:          return 'Offline Physics Tutor';
    }
  };

  const pageAccentColor = {
    dashboard: 'from-primary-500 to-indigo-500',
    chapters:  'from-indigo-500 to-violet-500',
    study:     'from-emerald-500 to-teal-500',
    progress:  'from-amber-500 to-orange-500',
  }[activePage] || 'from-primary-500 to-indigo-500';

  return (
    <>
      <header className="bg-white/90 backdrop-blur-md h-16 sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between relative"
        style={{ borderBottom: '1px solid rgba(15,23,42,0.06)', boxShadow: '0 1px 20px -8px rgba(79,117,247,0.08)' }}>
        
        {/* Thin colored bottom accent line */}
        <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${pageAccentColor} opacity-60`} />

        <div className="flex items-center gap-3">
          {/* Mobile menu trigger */}
          <button 
            onClick={toggleMobileSidebar}
            className="p-2 -ml-2 rounded-lg hover:bg-slate-50 md:hidden text-slate-500 hover:text-slate-700 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <h1 className="text-lg font-bold font-display text-slate-800 tracking-tight flex items-center gap-2">
            <div className={`w-5 h-5 rounded-md bg-gradient-to-tr ${pageAccentColor} flex items-center justify-center hidden md:flex`}>
              <GraduationCap className="w-3 h-3 text-white stroke-[2.5]" />
            </div>
            {getPageTitle()}
          </h1>
        </div>

        {student && (
          <div className="flex items-center gap-3">
            {/* User profile pill - click opens Student Profile Modal */}
            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border transition-all duration-200 cursor-pointer group hover:border-primary-300 hover:shadow-md hover:shadow-primary-500/10 active:scale-95 text-left"
              style={{ background: 'rgba(248,250,252,0.85)', borderColor: 'rgba(226,232,240,0.8)', backdropFilter: 'blur(8px)' }}
              title="Click to view your student profile"
            >
              {/* Gradient avatar ring */}
              <div className="relative w-7 h-7 rounded-full flex items-center justify-center shrink-0">
                <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${pageAccentColor} opacity-20 group-hover:opacity-40 transition-opacity`} />
                <div className={`w-6 h-6 rounded-full bg-gradient-to-tr ${pageAccentColor} text-white flex items-center justify-center text-[11px] font-bold shadow-sm`}>
                  {student.student_name ? student.student_name[0].toUpperCase() : 'S'}
                </div>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-700 leading-none group-hover:text-primary-600 transition-colors">
                  {student.student_name}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">Class 12 student</p>
              </div>
            </button>

            <button
              onClick={onLogout}
              title="Logout"
              className="p-2 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 border border-slate-100/60 hover:border-red-100/50 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>

      {/* Interactive Student Profile Modal */}
      <StudentProfileModal
        student={student}
        progressData={progressData}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onLogout={onLogout}
        onNavigateProgress={onNavigateProgress}
      />
    </>
  );
}
