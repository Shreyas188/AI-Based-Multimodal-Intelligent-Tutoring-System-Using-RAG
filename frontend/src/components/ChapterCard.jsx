import React from 'react';
import { BookOpen, CheckCircle, Lock, ArrowRight, Award, Zap } from 'lucide-react';

export default function ChapterCard({ chapter, onClick, completedTopics = 0, totalTopics = 0, progressPercentage = 0 }) {
  const isUnlocked  = chapter.is_unlocked === 1;
  const isCompleted = chapter.is_completed === 1;
  const testPassed  = chapter.final_test_passed === 1;
  const testUnlocked = chapter.final_test_unlocked === 1;

  const accentGradient = testPassed
    ? 'from-emerald-400 to-teal-500'
    : isUnlocked
      ? 'from-primary-500 to-indigo-500'
      : 'from-slate-300 to-slate-400';

  return (
    <div 
      className={`bg-white rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between group ${
        isUnlocked 
          ? 'border-slate-100/80 cursor-pointer card-hover animate-fade-in-up'
          : 'border-slate-200/60 bg-slate-50/40 opacity-70 select-none'
      }`}
      style={isUnlocked ? { boxShadow: '0 2px 12px -4px rgba(15,23,42,0.06)' } : {}}
      onClick={isUnlocked ? onClick : undefined}
    >
      {/* Top Gradient Accent Strip */}
      <div className={`h-1 w-full bg-gradient-to-r ${accentGradient}`} />

      {/* Glowing top-right orb on hover */}
      {isUnlocked && (
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${accentGradient} opacity-0 group-hover:opacity-[0.06] rounded-bl-full transition-opacity duration-400 pointer-events-none`} />
      )}

      <div className="p-5 flex-1 flex flex-col justify-between space-y-5">
        <div className="space-y-3">
          {/* Badges */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-display">
              Chapter {chapter.order_no}
            </span>
            <div className="flex items-center gap-1.5">
              {!isUnlocked ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full uppercase tracking-wider font-display">
                  <Lock className="w-2.5 h-2.5" /> Locked
                </span>
              ) : testPassed ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 uppercase tracking-wider font-display">
                  <Award className="w-2.5 h-2.5" /> Test Passed
                </span>
              ) : testUnlocked ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-100 uppercase tracking-wider font-display">
                  <Zap className="w-2.5 h-2.5" /> Test Unlocked
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-full border border-primary-100 uppercase tracking-wider font-display">
                  Active
                </span>
              )}
            </div>
          </div>

          <h4 className="text-base font-bold text-slate-800 font-display line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
            {chapter.title}
          </h4>
        </div>

        {/* Progress bar */}
        {isUnlocked && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                {completedTopics}/{totalTopics} Topics
              </span>
              <span className="font-bold text-slate-700">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full bg-gradient-to-r ${accentGradient} progress-fill`}
                style={{ width: `${progressPercentage}%`, '--progress-width': `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-50">
          {isUnlocked ? (
            <>
              <span className="text-xs text-slate-400 font-medium">
                {testPassed ? 'Quiz & Test cleared!' : 'Study topic by topic'}
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-primary-600 group-hover:gap-2 transition-all duration-200">
                Open
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
              </span>
            </>
          ) : (
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <Lock className="w-3 h-3" /> Complete previous chapters to unlock.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
