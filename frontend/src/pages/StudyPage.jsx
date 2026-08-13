import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, CheckCircle, HelpCircle, MessageSquare, ChevronRight, AlertCircle, RefreshCw, Trophy, Lock, Unlock, Sparkles, ArrowRight, Maximize2, Minimize2 } from 'lucide-react';
import { api } from '../api/api';
import StudyContent from '../components/StudyContent';
import DoubtChatbot from '../components/DoubtChatbot';
import QuizSection from '../components/QuizSection';
import LoadingSpinner from '../components/LoadingSpinner';

export default function StudyPage({ 
  studentId, 
  topicId, 
  chapterId, 
  onBack, 
  refreshProgress,
  addToast
}) {
  const [material, setMaterial] = useState(null);
  const [topicStatus, setTopicStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Step state: 1 = Study, 2 = Doubt, 3 = Quiz
  const [activeStep, setActiveStep] = useState(1);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizLoading, setQuizLoading] = useState(false);

  // Success modal state
  const [showPassModal, setShowPassModal] = useState(false);
  const [passScore, setPassScore] = useState(0);

  // Fullscreen Focus Study Mode state
  const [isPageFullscreen, setIsPageFullscreen] = useState(false);

  const togglePageFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
      setIsPageFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => console.log(err));
        setIsPageFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsPageFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const matRes = await api.getStudyMaterials(topicId, studentId);
      if (matRes.success && matRes.materials && matRes.materials.length > 0) {
        setMaterial(matRes.materials[0]);
      } else {
        throw new Error(matRes.message || "Failed to retrieve study material content.");
      }

      const topicsRes = await api.getTopics(chapterId, studentId);
      const matchedTopic = topicsRes.topics?.find(t => String(t.id) === String(topicId));
      if (matchedTopic) {
        setTopicStatus(matchedTopic);
      } else {
        throw new Error("Topic tracking details not found.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Could not retrieve topic materials from the backend.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [topicId, studentId, chapterId]);

  // Set initial active step based on progress
  useEffect(() => {
    if (topicStatus) {
      if (topicStatus.topic_quiz_passed === 1) {
        setActiveStep(1); // Standard view for completed topics
      } else if (topicStatus.is_studied === 1) {
        setActiveStep(3); // Start straight at quiz if already completed reading
      } else {
        setActiveStep(1);
      }
    }
  }, [topicStatus]);

  // Auto load quiz questions when step 3 is activated
  useEffect(() => {
    const isStudied = topicStatus?.is_studied === 1;
    if (activeStep === 3 && quizQuestions.length === 0 && isStudied) {
      const loadQuiz = async () => {
        setQuizLoading(true);
        try {
          const response = await api.getTopicQuiz(topicId, studentId);
          if (response.success) {
            setQuizQuestions(response.questions || []);
          }
        } catch (e) {
          console.error("Failed to load quiz", e);
        } finally {
          setQuizLoading(false);
        }
      };
      loadQuiz();
    }
  }, [activeStep, quizQuestions.length, topicStatus, topicId, studentId]);

  const handleMarkStudied = async () => {
    try {
      const response = await api.markTopicStudied(studentId, topicId);
      if (response.success) {
        addToast("Topic completed! Quiz unlocked.", "success");
        await fetchData();
        if (refreshProgress) refreshProgress();
        setActiveStep(2); // Automatically advance to doubts
      } else {
        throw new Error(response.message || "Could not mark topic as completed.");
      }
    } catch (err) {
      console.error(err);
      addToast(err.message || "Failed to mark topic as completed.", "error");
    }
  };

  const handleQuizSuccess = (percentage) => {
    setPassScore(percentage || 70);
    setShowPassModal(true);
  };

  if (isLoading) {
    return <LoadingSpinner message="Opening physics learning workspace..." />;
  }

  if (errorMsg) {
    return (
      <div className="p-6 text-center max-w-lg mx-auto bg-white rounded-2xl border border-slate-100 mt-12 shadow-sm space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-700 font-display">Workspace Load Error</h3>
        <p className="text-xs text-slate-400 font-medium leading-relaxed">{errorMsg}</p>
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
        >
          Return to Chapters
        </button>
      </div>
    );
  }

  const isStudied = topicStatus?.is_studied === 1;
  const isQuizPassed = topicStatus?.topic_quiz_passed === 1;
  const quizScore = topicStatus?.topic_quiz_score;


  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* 1. Header Navigation */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-white border border-slate-150 text-slate-500 hover:text-slate-700 hover:border-slate-200 transition-colors shadow-sm"
            title="Back to Topics"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-display">Study Mode</span>
            <h2 className="text-xl font-bold font-display text-slate-800 tracking-tight">{material.title}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={togglePageFullscreen}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 hover:border-primary-300 text-slate-600 hover:text-primary-600 transition-all shadow-sm flex items-center gap-1.5"
            title={isPageFullscreen ? "Exit Fullscreen Focus Mode" : "Enter Distraction-Free Focus Study Mode"}
          >
            {isPageFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-primary-500" /> : <Maximize2 className="w-3.5 h-3.5 text-primary-500" />}
            <span className="text-xs font-bold font-display hidden sm:inline">
              {isPageFullscreen ? "Exit Focus" : "Focus Mode"}
            </span>
          </button>

          <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-display border ${
            isQuizPassed 
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
              : isStudied
                ? 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'
                : 'bg-primary-50 text-primary-600 border-primary-100'
          }`}>
            {isQuizPassed ? `Quiz Passed (${quizScore}%)` : isStudied ? 'Quiz Available' : 'Studying'}
          </span>
        </div>
      </div>

      {/* 2. Horizontal Navigation Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Button 1: Study Summary */}
        <button
          onClick={() => setActiveStep(1)}
          className={`p-4 rounded-2xl border text-left transition-all duration-300 flex items-center gap-3.5 shadow-sm ${
            activeStep === 1
              ? 'bg-primary-500 text-white border-primary-600 shadow-md shadow-primary-500/15'
              : 'bg-white text-slate-700 border-slate-100 hover:border-slate-200 hover:shadow-md'
          }`}
        >
          <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
            activeStep === 1
              ? 'bg-white/20 text-white'
              : isStudied
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-slate-100 text-slate-500'
          }`}>
            {isStudied ? <CheckCircle className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
          </span>
          <div className="min-w-0">
            <h4 className="font-bold text-xs font-display tracking-tight leading-none">Study Summary</h4>
            <span className={`text-[9px] font-bold block mt-1 uppercase tracking-wider ${
              activeStep === 1 ? 'text-white/80' : isStudied ? 'text-emerald-600' : 'text-slate-400'
            }`}>
              {isStudied ? 'Completed' : 'Active'}
            </span>
          </div>
        </button>

        {/* Button 2: Ask AI Tutor */}
        <button
          disabled={!isStudied}
          onClick={() => isStudied && setActiveStep(2)}
          className={`p-4 rounded-2xl border text-left transition-all duration-300 flex items-center gap-3.5 shadow-sm ${
            !isStudied
              ? 'bg-slate-50/50 text-slate-400 border-slate-100 cursor-not-allowed opacity-60'
              : activeStep === 2
                ? 'bg-primary-500 text-white border-primary-600 shadow-md shadow-primary-500/15'
                : 'bg-white text-slate-700 border-slate-100 hover:border-slate-200 hover:shadow-md'
          }`}
        >
          <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
            activeStep === 2
              ? 'bg-white/20 text-white'
              : 'bg-slate-100 text-slate-500'
          }`}>
            {!isStudied ? <Lock className="w-4 h-4" /> : <MessageSquare className="w-5 h-5" />}
          </span>
          <div className="min-w-0">
            <h4 className="font-bold text-xs font-display tracking-tight leading-none">Ask AI Tutor</h4>
            <span className={`text-[9px] font-bold block mt-1 uppercase tracking-wider ${
              !isStudied 
                ? 'text-slate-400' 
                : activeStep === 2 
                  ? 'text-white/80' 
                  : isQuizPassed 
                    ? 'text-slate-400' 
                    : 'text-primary-600 animate-pulse'
            }`}>
              {!isStudied ? 'Locked' : activeStep === 2 ? 'Active' : 'Recommended'}
            </span>
          </div>
        </button>

        {/* Button 3: Topic Quiz */}
        <button
          disabled={!isStudied}
          onClick={() => isStudied && setActiveStep(3)}
          className={`p-4 rounded-2xl border text-left transition-all duration-300 flex items-center gap-3.5 shadow-sm ${
            !isStudied
              ? 'bg-slate-50/50 text-slate-400 border-slate-100 cursor-not-allowed opacity-60'
              : activeStep === 3
                ? 'bg-primary-500 text-white border-primary-600 shadow-md shadow-primary-500/15'
                : 'bg-white text-slate-700 border-slate-100 hover:border-slate-200 hover:shadow-md'
          }`}
        >
          <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
            activeStep === 3
              ? 'bg-white/20 text-white'
              : isQuizPassed
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-slate-100 text-slate-500'
          }`}>
            {!isStudied ? <Lock className="w-4 h-4" /> : isQuizPassed ? <Trophy className="w-5 h-5" /> : <HelpCircle className="w-5 h-5" />}
          </span>
          <div className="min-w-0">
            <h4 className="font-bold text-xs font-display tracking-tight leading-none">Topic Quiz</h4>
            <span className={`text-[9px] font-bold block mt-1 uppercase tracking-wider ${
              !isStudied 
                ? 'text-slate-400' 
                : activeStep === 3 
                  ? 'text-white/80' 
                  : isQuizPassed 
                    ? 'text-emerald-600' 
                    : 'text-amber-600'
            }`}>
              {!isStudied ? 'Locked' : isQuizPassed ? 'Passed' : 'Available'}
            </span>
          </div>
        </button>
      </div>

      {/* 3. Main Active Content View Area */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {activeStep === 1 && (
          <div className="p-6 space-y-6">
            <StudyContent material={material} imagePath={material.video_path} />
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              {!isStudied ? (
                <button
                  onClick={handleMarkStudied}
                  className="flex items-center gap-1.5 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-500/10 transition-all"
                >
                  <CheckCircle className="w-4 h-4" />
                  I Completed This Topic
                </button>
              ) : (
                <button
                  onClick={() => setActiveStep(2)}
                  className="flex items-center gap-1.5 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl text-xs shadow-md shadow-primary-500/10 transition-all"
                >
                  <span>Proceed to doubts</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {activeStep === 2 && isStudied && (
          <div className="p-6 space-y-6">
            <DoubtChatbot 
              studentId={studentId} 
              topicId={topicId} 
              topicTitle={material.title} 
            />
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveStep(3)}
                className="flex items-center gap-1.5 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl text-xs shadow-md shadow-primary-500/10 transition-all"
              >
                <span>Go to Topic Quiz</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeStep === 3 && isStudied && (
          <div className="p-6">
            {quizLoading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner message="Assembling evaluation questions..." />
              </div>
            ) : (
              <QuizSection
                studentId={studentId}
                topicId={topicId}
                questions={quizQuestions}
                onSuccess={handleQuizSuccess}
                onClose={onBack}
              />
            )}
          </div>
        )}

      </div>

      {/* 3. Stored Success Modal Popup */}
      {showPassModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-100 shadow-2xl text-center space-y-6 animate-physics-float" style={{ animationDuration: '3s' }}>
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <Trophy className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold font-display text-slate-800">Topic Cleared!</h3>
              <p className="text-sm font-medium text-slate-500 leading-relaxed">
                Awesome job! You successfully passed the topic quiz with a score of <strong className="text-emerald-600">{passScore}%</strong>.
              </p>
            </div>
            <button
              onClick={() => {
                setShowPassModal(false);
                onBack();
              }}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-500/10 hover:shadow-emerald-600/20"
            >
              Continue to Topics List
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
