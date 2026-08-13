import React, { useState, useEffect } from 'react';
import TopicCard from '../components/TopicCard';
import QuizSection from '../components/QuizSection';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, Award, Lock, BookOpen, AlertCircle, HelpCircle } from 'lucide-react';
import { api } from '../api/api';

export default function ChapterPage({ 
  studentId, 
  chapterId, 
  onBack, 
  onStudyTopic, 
  refreshProgress,
  addToast
}) {
  const [chapter, setChapter] = useState(null);
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Chapter Test active runner state
  const [examActive, setExamActive] = useState(false);
  const [examQuestions, setExamQuestions] = useState([]);
  const [examLoading, setExamLoading] = useState(false);

  const fetchChapterDetails = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      // Get all chapters to locate our matching details
      const chapRes = await api.getChapters(studentId);
      const matchedCh = chapRes.chapters.find(c => String(c.id) === String(chapterId));
      
      if (!matchedCh) {
        throw new Error("Chapter data not found.");
      }
      setChapter(matchedCh);

      // Get topics for this chapter
      const topicsRes = await api.getTopics(chapterId, studentId);
      setTopics(topicsRes.topics || []);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to load chapter structure. Verify backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChapterDetails();
  }, [chapterId, studentId]);

  const handleStartExam = async () => {
    setExamLoading(true);
    setErrorMsg("");
    try {
      const response = await api.getChapterTest(chapterId, studentId);
      if (response.success) {
        setExamQuestions(response.questions || []);
        setExamActive(true);
      } else {
        throw new Error(response.message || "Failed to load exam questions.");
      }
    } catch (err) {
      console.error(err);
      addToast(err.message || "Chapter test is locked or unavailable.", "error");
    } finally {
      setExamLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Gathering chapter curriculum..." />;
  }

  if (errorMsg && !chapter) {
    return (
      <div className="p-6 text-center max-w-lg mx-auto bg-white rounded-2xl border border-slate-100 mt-12 shadow-sm space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-700 font-display">Curriculum Error</h3>
        <p className="text-xs text-slate-400 font-medium leading-relaxed">{errorMsg}</p>
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const completedCount = topics.filter(t => t.topic_quiz_passed === 1).length;
  const progressPercent = topics.length > 0 ? (completedCount / topics.length) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* 1. Header Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-lg bg-white border border-slate-150 text-slate-500 hover:text-slate-700 hover:border-slate-200 transition-colors shadow-sm"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-display">Course Curriculum</span>
          <h2 className="text-xl font-bold font-display text-slate-800 tracking-tight">Chapter {chapter.order_no}: {chapter.title}</h2>
        </div>
      </div>

      {/* 2. Chapter Progress Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 flex-1">
          <h3 className="text-sm font-bold font-display text-slate-700">Completion Milestones</h3>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="bg-primary-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-sm font-bold text-slate-600 shrink-0 font-display">
              {Math.round(progressPercent)}% Passed
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            {completedCount}/{topics.length} topics cleared with a passing score. Clear all topic quizzes to unlock the Final Exam.
          </p>
        </div>
      </div>

      {/* 3. Chapter Exam Active State */}
      {examActive ? (
        <div className="bg-slate-50/50 rounded-3xl border border-slate-100 p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <span className="text-[9px] font-bold text-primary-500 bg-primary-50 border border-primary-100 px-2 py-0.5 rounded uppercase tracking-wider font-display">Active Session</span>
              <h3 className="text-lg font-bold font-display text-slate-800 mt-1">Final Chapter Exam: {chapter.title}</h3>
            </div>
            <button
              onClick={() => setExamActive(false)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wide"
            >
              Cancel Exam
            </button>
          </div>
          
          <QuizSection
            studentId={studentId}
            chapterId={chapterId}
            isChapterTest={true}
            questions={examQuestions}
            onSuccess={() => {
              addToast("Congratulations! You passed the chapter final exam!", "success");
              fetchChapterDetails();
              if (refreshProgress) refreshProgress();
            }}
            onClose={() => {
              setExamActive(false);
              fetchChapterDetails();
              if (refreshProgress) refreshProgress();
            }}
          />
        </div>
      ) : (
        /* 4. Normal Chapter Grid & Final Exam unlock details */
        <div className="space-y-6">
          {/* Topics Grid */}
          <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {topics.map(topic => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onStudy={() => onStudyTopic(topic)}
              />
            ))}
          </div>

          {/* Chapter Final Test Status Card */}
          <div className={`mt-8 rounded-3xl p-6 border transition-all duration-300 ${
            chapter.final_test_passed === 1
              ? 'bg-emerald-50/30 border-emerald-100 text-emerald-950'
              : chapter.final_test_unlocked === 1
                ? 'bg-indigo-50/30 border-indigo-100 text-indigo-950 shadow-md shadow-indigo-500/5'
                : 'bg-slate-50/40 border-slate-200 text-slate-500'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl shrink-0 ${
                  chapter.final_test_passed === 1 ? 'bg-emerald-500 text-white' :
                  chapter.final_test_unlocked === 1 ? 'bg-indigo-500 text-white animate-pulse' :
                  'bg-slate-200 text-slate-400'
                }`}>
                  {chapter.final_test_passed === 1 ? <Award className="w-8 h-8" /> :
                   chapter.final_test_unlocked === 1 ? <BookOpen className="w-8 h-8" /> :
                   <Lock className="w-8 h-8" />}
                </div>

                <div className="space-y-1">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider font-display ${
                    chapter.final_test_passed === 1 ? 'bg-emerald-100 border-emerald-200 text-emerald-700' :
                    chapter.final_test_unlocked === 1 ? 'bg-indigo-100 border-indigo-200 text-indigo-700' :
                    'bg-slate-100 border-slate-200 text-slate-500'
                  }`}>
                    Final Chapter Exam
                  </span>
                  <h4 className="text-base font-bold font-display text-slate-800 leading-snug">
                    {chapter.final_test_passed === 1 
                      ? `Exam Passed (Score: ${chapter.final_test_score}%)`
                      : chapter.final_test_unlocked === 1
                        ? "Exam Unlocked & Available"
                        : "Exam Locked"
                    }
                  </h4>
                  <p className="text-xs text-slate-500 font-medium max-w-lg leading-relaxed">
                    {chapter.final_test_passed === 1
                      ? "Great! You have cleared this chapter final exam. Feel free to review or study other chapters."
                      : chapter.final_test_unlocked === 1
                        ? "You've successfully cleared all individual topic quizzes. Click start below to test your conceptual knowledge on this entire chapter."
                        : "Complete the study summaries and pass quizzes for all topics in this chapter to unlock this final exam."
                    }
                  </p>
                </div>
              </div>

              {chapter.final_test_unlocked === 1 && (
                <button
                  onClick={handleStartExam}
                  disabled={examLoading}
                  className={`px-5 py-3 rounded-xl font-bold text-xs shadow-md transition-all self-start md:self-center shrink-0 ${
                    chapter.final_test_passed === 1
                      ? 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-600'
                      : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/20 text-white shadow-indigo-500/10'
                  }`}
                >
                  {examLoading ? 'Syncing Exam...' : chapter.final_test_passed === 1 ? 'Re-take Final Exam' : 'Start Chapter Exam'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
