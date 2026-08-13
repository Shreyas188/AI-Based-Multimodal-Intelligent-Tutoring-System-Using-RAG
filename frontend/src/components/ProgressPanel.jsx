import React from 'react';
import { Award, BookOpen, CheckCircle, Unlock, Lock, BarChart2 } from 'lucide-react';

export default function ProgressPanel({ progressData }) {
  if (!progressData || !progressData.progress || progressData.progress.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 border border-slate-100 shadow-sm text-center max-w-lg mx-auto">
        <BarChart2 className="w-12 h-12 text-slate-300 stroke-[1.5] mx-auto mb-4" />
        <h4 className="text-base font-bold font-display text-slate-700">No progress data found</h4>
        <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">
          Start studying topics and completing quizzes to build your progress reports.
        </p>
      </div>
    );
  }

  // Aggregate stats across all chapters
  let totalTopics = 0;
  let studiedTopics = 0;
  let quizPassedCount = 0;
  let unlockedTopics = 0;
  let totalChapters = progressData.progress.length;
  let completedChaptersCount = 0;

  progressData.progress.forEach(chData => {
    totalTopics += chData.total_topics || 0;
    studiedTopics += chData.studied_topics || 0;
    unlockedTopics += chData.unlocked_topics || 0;
    
    // Topics with quizzes passed
    const passedInChapter = chData.topics.filter(t => t.topic_quiz_passed === 1).length;
    quizPassedCount += passedInChapter;

    if (chData.chapter.final_test_passed === 1) {
      completedChaptersCount++;
    }
  });

  return (
    <div className="space-y-8">
      {/* 1. Global Performance Metrics */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Stat 1: Studied Topics */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 card-hover animate-fade-in-up stagger-1 flex items-center gap-4" style={{ boxShadow: '0 2px 12px -4px rgba(15,23,42,0.06)' }}>
          <div className="p-3 rounded-xl shrink-0 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(79,117,247,0.12), rgba(99,102,241,0.08))' }}>
            <div className="absolute inset-0 shimmer-bg opacity-0 group-hover:opacity-100" />
            <BookOpen className="w-5 h-5 text-primary-500" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Studied Topics</span>
            <span className="text-2xl font-bold font-display text-slate-800 leading-none">{studiedTopics}</span>
            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">out of {totalTopics}</span>
          </div>
        </div>

        {/* Stat 2: Quizzes Passed */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 card-hover animate-fade-in-up stagger-2 flex items-center gap-4" style={{ boxShadow: '0 2px 12px -4px rgba(15,23,42,0.06)' }}>
          <div className="p-3 rounded-xl shrink-0" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(20,184,166,0.08))' }}>
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Quizzes Passed</span>
            <span className="text-2xl font-bold font-display text-slate-800 leading-none">{quizPassedCount}</span>
            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">out of {totalTopics}</span>
          </div>
        </div>

        {/* Stat 3: Unlocked Topics */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 card-hover animate-fade-in-up stagger-3 flex items-center gap-4" style={{ boxShadow: '0 2px 12px -4px rgba(15,23,42,0.06)' }}>
          <div className="p-3 rounded-xl shrink-0" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))' }}>
            <Unlock className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Unlocked Topics</span>
            <span className="text-2xl font-bold font-display text-slate-800 leading-none">{unlockedTopics}</span>
            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">available to study</span>
          </div>
        </div>

        {/* Stat 4: Chapters Completed */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 card-hover animate-fade-in-up stagger-4 flex items-center gap-4" style={{ boxShadow: '0 2px 12px -4px rgba(15,23,42,0.06)' }}>
          <div className="p-3 rounded-xl shrink-0" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.12), rgba(251,146,60,0.08))' }}>
            <Award className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tests Cleared</span>
            <span className="text-2xl font-bold font-display text-slate-800 leading-none">{completedChaptersCount}</span>
            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">out of {totalChapters}</span>
          </div>
        </div>
      </div>

      {/* 2. Chapter Breakdown List */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold font-display text-slate-800 tracking-tight">Chapter Performance Details</h3>
        
        <div className="space-y-4">
          {progressData.progress.map(chData => {
            const ch = chData.chapter;
            const isUnlocked = ch.is_unlocked === 1;

            return (
              <div 
                key={ch.id} 
                className={`bg-white rounded-2xl border transition-all duration-300 p-6 animate-fade-in-up card-hover ${
                  isUnlocked ? 'border-slate-100' : 'border-slate-200/60 bg-slate-50/20 opacity-70'
                }`}
                style={isUnlocked ? { boxShadow: '0 2px 12px -4px rgba(15,23,42,0.06)' } : {}}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Chapter {ch.order_no}</span>
                    <h4 className="text-base font-bold font-display text-slate-800 mt-0.5">{ch.title}</h4>
                  </div>
                  
                  {isUnlocked ? (
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs text-slate-500 font-semibold">{chData.completed_topics}/{chData.total_topics} topics passed</span>
                        <div className="w-28 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                          <div 
                            className="bg-primary-500 h-full rounded-full"
                            style={{ width: `${chData.progress_percentage}%` }}
                          />
                        </div>
                      </div>
                      
                      {ch.final_test_passed === 1 ? (
                        <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wider font-display shrink-0">
                          Final Passed
                        </span>
                      ) : ch.final_test_unlocked === 1 ? (
                        <span className="flex items-center gap-1 text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 uppercase tracking-wider font-display shrink-0">
                          Test Available
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wider font-display shrink-0">
                          Test Locked
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wider font-display self-start md:self-center shrink-0">
                      <Lock className="w-2.5 h-2.5" /> Chapter Locked
                    </span>
                  )}
                </div>

                {/* Topics status listing */}
                {isUnlocked && (
                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {chData.topics.map(topic => {
                      const tStudied = topic.is_studied === 1;
                      const tPassed = topic.topic_quiz_passed === 1;
                      const tUnlocked = topic.is_unlocked === 1;

                      let statusText = "Locked";
                      let statusStyle = "bg-slate-50 border-slate-200 text-slate-400";
                      
                      if (tUnlocked) {
                        if (tPassed) {
                          statusText = `Passed (${topic.topic_quiz_score}%)`;
                          statusStyle = "bg-emerald-50/50 border-emerald-100 text-emerald-700";
                        } else if (tStudied) {
                          statusText = "Quiz Ready";
                          statusStyle = "bg-amber-50/50 border-amber-100 text-amber-700";
                        } else {
                          statusText = "Unlocked";
                          statusStyle = "bg-primary-50/50 border-primary-100 text-primary-700";
                        }
                      }

                      return (
                        <div 
                          key={topic.id} 
                          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-semibold ${statusStyle}`}
                        >
                          <div className="truncate pr-2">
                            <span className="text-[9px] opacity-75 font-semibold block uppercase">Topic {topic.order_no}</span>
                            <span className="truncate block mt-0.5 font-bold leading-tight">{topic.title}</span>
                          </div>
                          <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-white/70 border border-current shrink-0">
                            {statusText}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
