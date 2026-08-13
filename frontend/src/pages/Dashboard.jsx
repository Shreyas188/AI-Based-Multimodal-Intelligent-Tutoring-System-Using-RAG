import React from 'react';
import StatCard from '../components/StatCard';
import ChapterCard from '../components/ChapterCard';
import { BookOpen, CheckSquare, Award, PlayCircle, BarChart2, Sparkles } from 'lucide-react';

export default function Dashboard({ progressData, onSelectChapter, onContinueLearning }) {
  if (!progressData || !progressData.progress || progressData.progress.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-slate-100 shadow-sm max-w-lg mx-auto mt-12">
        <BarChart2 className="w-12 h-12 text-slate-300 stroke-[1.5] mb-4" />
        <h3 className="text-base font-bold font-display text-slate-700">Course materials loading...</h3>
        <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">
          Please wait while we sync your local curriculum data.
        </p>
      </div>
    );
  }

  // Calculate statistics
  const totalChapters = progressData.progress.length;
  let totalTopicsCount = 0;
  let completedTopicsCount = 0;
  let currentLearningTopic = null;
  let currentLearningChapterId = null;
  let passedTestsCount = 0;

  progressData.progress.forEach(chData => {
    totalTopicsCount += chData.total_topics || 0;
    
    // Sum quiz passes
    const passedInChapter = chData.topics.filter(t => t.topic_quiz_passed === 1).length;
    completedTopicsCount += passedInChapter;

    // Check final test passes
    if (chData.chapter.final_test_passed === 1) {
      passedTestsCount++;
    }

    // Find the current learning target: first topic that is unlocked but not yet passed
    if (!currentLearningTopic && chData.chapter.is_unlocked === 1) {
      const pendingTopic = chData.topics.find(t => t.is_unlocked === 1 && t.topic_quiz_passed !== 1);
      if (pendingTopic) {
        currentLearningTopic = pendingTopic;
        currentLearningChapterId = chData.chapter.id;
      }
    }
  });

  // Calculate overall course progress percentage
  const overallProgressPercentage = totalTopicsCount > 0 
    ? (completedTopicsCount / totalTopicsCount) * 100 
    : 0;

  // Set default current learning target fallback to first topic of first chapter if all are passed
  if (!currentLearningTopic && progressData.progress.length > 0) {
    const firstCh = progressData.progress[0];
    if (firstCh.topics.length > 0) {
      currentLearningTopic = firstCh.topics[0];
      currentLearningChapterId = firstCh.chapter.id;
    }
  }

  const handleContinueClick = () => {
    if (currentLearningTopic && onContinueLearning) {
      onContinueLearning(currentLearningChapterId, currentLearningTopic);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl p-6 md:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden animate-fade-in-up"
        style={{ background: 'linear-gradient(135deg, #3b55ed 0%, #4f75f7 40%, #6366f1 100%)', boxShadow: '0 20px 60px -16px rgba(79,117,247,0.45)' }}>
        
        {/* Animated mesh background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-30%] right-[-10%] w-72 h-72 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)', animation: 'float 8s ease-in-out infinite' }} />
          <div className="absolute bottom-[-40%] left-[-5%] w-64 h-64 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)', animation: 'float 10s ease-in-out infinite reverse' }} />
          {/* Grid dots pattern */}
          <div className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        </div>

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-primary-200" />
            <span className="text-[10px] font-bold text-primary-200 uppercase tracking-widest">Your Learning Journey</span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold font-display leading-tight tracking-tight">
            Ready to study, Champion?
          </h2>
          <p className="text-sm font-medium text-primary-100 max-w-lg leading-relaxed">
            {currentLearningTopic 
              ? `You're currently studying: "${currentLearningTopic.title}". Complete the quiz to unlock the next chapter topic.`
              : "Amazing! You have completed all topic quizzes in the syllabus. Take your final tests to review."
            }
          </p>
        </div>
        
        {currentLearningTopic && (
          <button
            onClick={handleContinueClick}
            className="flex items-center justify-center gap-2 px-5 py-3 font-bold rounded-xl text-sm transition-all group shrink-0 relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.95)', color: '#3b55ed', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'; }}
          >
            <div className="absolute inset-0 shimmer-bg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <PlayCircle className="w-5 h-5 relative z-10" style={{ fill: '#3b55ed' }} />
            <span className="relative z-10">Continue Learning</span>
          </button>
        )}
      </div>

      {/* Progress Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <div className="stagger-1">
          <StatCard title="Chapters" value={totalChapters} icon={BookOpen} description="Class 12 Syllabus" colorClass="from-blue-500 to-cyan-500" />
        </div>
        <div className="stagger-2">
          <StatCard title="Topics Completed" value={`${completedTopicsCount}/${totalTopicsCount}`} icon={CheckSquare} description="Quizzes Cleared" colorClass="from-emerald-500 to-teal-500" trend={{ type: 'success', text: `${Math.round(overallProgressPercentage)}% Done` }} />
        </div>
        <div className="stagger-3">
          <StatCard title="Current Target" value={currentLearningTopic ? `Topic ${currentLearningTopic.order_no}` : "Finished"} icon={PlayCircle} description={currentLearningTopic ? currentLearningTopic.title : "All quizzes passed"} colorClass="from-amber-500 to-orange-500" />
        </div>
        <div className="stagger-4">
          <StatCard title="Chapter Exams" value={`${passedTestsCount}/${totalChapters}`} icon={Award} description="Final Tests Cleared" colorClass="from-indigo-500 to-violet-500" />
        </div>
        <div className="stagger-5">
          <StatCard title="Overall Progress" value={`${Math.round(overallProgressPercentage)}%`} icon={BarChart2} description="Syllabus %" colorClass="from-pink-500 to-rose-500" />
        </div>
      </div>

      {/* Course Chapters Section */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-display text-slate-800 tracking-tight">Your Course Syllabus</h3>
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Pass quiz to unlock next topic</span>
        </div>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {progressData.progress.map(chData => (
            <ChapterCard
              key={chData.chapter.id}
              chapter={chData.chapter}
              onClick={() => onSelectChapter(chData.chapter.id)}
              completedTopics={chData.completed_topics}
              totalTopics={chData.total_topics}
              progressPercentage={chData.progress_percentage}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
