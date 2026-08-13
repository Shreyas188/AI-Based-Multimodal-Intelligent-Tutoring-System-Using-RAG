import React from 'react';
import { Lock, Unlock, CheckSquare, Trophy, BookOpen } from 'lucide-react';

export default function TopicCard({ topic, onStudy }) {
  const isUnlocked = topic.is_unlocked === 1;
  const isStudied = topic.is_studied === 1;
  const isQuizPassed = topic.topic_quiz_passed === 1;
  const quizScore = topic.topic_quiz_score;

  // Compute status badge details
  let badgeConfig = {
    text: "Locked",
    color: "bg-slate-100 text-slate-400 border-slate-200",
    icon: Lock
  };

  if (isUnlocked) {
    if (isQuizPassed) {
      badgeConfig = {
        text: `Passed (${quizScore}%)`,
        color: "bg-emerald-50 text-emerald-600 border-emerald-100",
        icon: Trophy
      };
    } else if (isStudied) {
      badgeConfig = {
        text: "Quiz Pending",
        color: "bg-amber-50 text-amber-600 border-amber-100",
        icon: CheckSquare
      };
    } else {
      badgeConfig = {
        text: "Unlocked",
        color: "bg-primary-50 text-primary-600 border-primary-100",
        icon: Unlock
      };
    }
  }

  const BadgeIcon = badgeConfig.icon;

  return (
    <div 
      className={`bg-white rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between ${
        isUnlocked 
          ? 'border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200' 
          : 'border-slate-200 bg-slate-50/40 select-none'
      }`}
    >
      <div className="space-y-4">
        {/* Header containing topic number & status */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-display">
            Topic {topic.order_no}
          </span>
          <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeConfig.color} uppercase tracking-wider font-display`}>
            <BadgeIcon className="w-2.5 h-2.5" />
            {badgeConfig.text}
          </span>
        </div>

        {/* Title */}
        <h5 className={`font-bold text-base font-display ${isUnlocked ? 'text-slate-800' : 'text-slate-400'}`}>
          {topic.title}
        </h5>
      </div>

      {/* Footer containing CTA */}
      <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
        {isUnlocked ? (
          <>
            <span className="text-xs text-slate-400 font-medium">
              {isQuizPassed 
                ? 'Revision mode active' 
                : isStudied 
                  ? 'Ready to take quiz' 
                  : 'Start study material'
              }
            </span>
            <button
              onClick={() => onStudy(topic)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                isQuizPassed
                  ? 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                  : 'bg-primary-500 text-white hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/20'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              {isQuizPassed ? 'Review' : 'Study Topic'}
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium py-1">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            Complete previous quiz to unlock
          </div>
        )}
      </div>
    </div>
  );
}
