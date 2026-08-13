import React from 'react';
import { 
  X, 
  User, 
  Mail, 
  Award, 
  CheckCircle, 
  BookOpen, 
  Zap, 
  LogOut, 
  Sparkles, 
  GraduationCap, 
  TrendingUp, 
  ShieldCheck 
} from 'lucide-react';

export default function StudentProfileModal({ student, progressData, isOpen, onClose, onLogout, onNavigateProgress }) {
  if (!isOpen || !student) return null;

  // Calculate metrics from progressData
  let totalChapters = 0;
  let completedTopics = 0;
  let totalTopics = 0;
  let passedTests = 0;
  let syllabusPercentage = 0;

  if (progressData && progressData.progress) {
    totalChapters = progressData.progress.length;
    progressData.progress.forEach(ch => {
      totalTopics += ch.total_topics || 0;
      completedTopics += ch.completed_topics || 0;
      if (ch.chapter && ch.chapter.final_test_passed === 1) {
        passedTests += 1;
      }
    });
    if (totalTopics > 0) {
      syllabusPercentage = Math.round((completedTopics / totalTopics) * 100);
    }
  }

  // Determine achievement badges
  const achievements = [
    {
      id: 'first_step',
      title: 'Physics Explorer',
      description: 'Started Class 12 Physics syllabus',
      unlocked: true,
      icon: '🚀',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'topic_master',
      title: 'Quiz Champion',
      description: 'Passed 3+ topic quizzes',
      unlocked: completedTopics >= 3,
      icon: '⚡',
      color: 'from-amber-500 to-orange-500'
    },
    {
      id: 'ch1_cleared',
      title: 'Electrostatics Ace',
      description: 'Passed Chapter 1 Final Test',
      unlocked: passedTests >= 1,
      icon: '🏆',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'syllabus_half',
      title: 'Board Exam Ready',
      description: 'Completed 50%+ of syllabus',
      unlocked: syllabusPercentage >= 50,
      icon: '🎓',
      color: 'from-violet-500 to-purple-600'
    }
  ];

  const circumference = 2 * Math.PI * 34; // r = 34
  const strokeDashoffset = circumference - (syllabusPercentage / 100) * circumference;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden relative animate-fade-in-up"
        style={{ boxShadow: '0 25px 50px -12px rgba(79, 117, 247, 0.25), 0 0 0 1px rgba(226, 232, 240, 0.8)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Background Gradient Banner */}
        <div 
          className="h-28 relative flex items-start justify-between p-5 text-white overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #3b55ed 0%, #4f75f7 50%, #6366f1 100%)' }}
        >
          {/* Subtle grid pattern */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '16px 16px' }}
          />
          {/* Glowing orb */}
          <div className="absolute top-[-50%] right-[-10%] w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          <div className="flex items-center gap-2 relative z-10">
            <span className="text-[11px] font-bold uppercase tracking-widest text-primary-200 flex items-center gap-1.5 font-display">
              <Sparkles className="w-3.5 h-3.5" /> Student Profile Card
            </span>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors relative z-10"
            title="Close Profile"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Identity Row (Overlapping banner) */}
        <div className="px-6 relative pb-6 space-y-6">
          <div className="flex items-end justify-between -mt-12">
            {/* Avatar with gradient border & glow */}
            <div className="relative">
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold font-display border-4 border-white shadow-xl shadow-primary-500/20 relative z-10"
                style={{ background: 'linear-gradient(135deg, #4f75f7, #6366f1)' }}
              >
                {student.student_name ? student.student_name[0].toUpperCase() : 'S'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white z-20" title="Active Student">
                <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            </div>

            {/* Circular Progress Ring */}
            <div className="flex items-center gap-3 bg-slate-50/80 px-3.5 py-2 rounded-2xl border border-slate-100">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    className="text-slate-200 stroke-current"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    className="text-primary-500 stroke-current transition-all duration-1000 ease-out"
                    strokeWidth="6"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-[11px] font-bold text-slate-800 font-display">
                  {syllabusPercentage}%
                </span>
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Syllabus</p>
                <p className="text-xs font-bold text-slate-700 font-display">Completed</p>
              </div>
            </div>
          </div>

          {/* Student Info Details */}
          <div className="space-y-1">
            <h3 className="text-xl font-bold font-display text-slate-800 tracking-tight flex items-center gap-2">
              {student.student_name}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1 font-medium">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {student.email || 'student@physicstutor.local'}
              </span>
              <span className="text-slate-300">•</span>
              <span className="bg-primary-50 text-primary-600 font-bold px-2.5 py-0.5 rounded-full border border-primary-100/80 text-[10px] uppercase tracking-wide">
                Class 12 CBSE Physics
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[10px] font-mono font-bold text-slate-400">
                #STU-{student.student_id || student.id || '101'}
              </span>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Topics Passed</span>
              <span className="text-lg font-bold font-display text-slate-800 block">
                {completedTopics}/{totalTopics}
              </span>
            </div>
            <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Final Tests</span>
              <span className="text-lg font-bold font-display text-slate-800 block">
                {passedTests}/{totalChapters}
              </span>
            </div>
            <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Chapters</span>
              <span className="text-lg font-bold font-display text-slate-800 block">
                {totalChapters} Active
              </span>
            </div>
          </div>

          {/* Badges & Achievements */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-500" /> Milestones & Badges
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              {achievements.map((ach) => (
                <div 
                  key={ach.id}
                  className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                    ach.unlocked 
                      ? 'bg-white border-slate-200/80 shadow-sm' 
                      : 'bg-slate-50/60 border-slate-100 opacity-50'
                  }`}
                >
                  <div className="text-xl shrink-0">{ach.icon}</div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-700 truncate leading-tight">{ach.title}</p>
                    <p className="text-[10px] text-slate-400 truncate">{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              onClick={() => {
                onClose();
                if (onNavigateProgress) onNavigateProgress();
              }}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-primary-600 bg-primary-50 hover:bg-primary-100 border border-primary-100 transition-colors flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              View Full Progress
            </button>

            <button
              onClick={() => {
                onClose();
                if (onLogout) onLogout();
              }}
              className="py-2.5 px-4 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
