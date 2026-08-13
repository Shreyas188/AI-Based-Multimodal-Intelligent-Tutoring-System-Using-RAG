import React, { useState } from 'react';
import { Award, AlertCircle, CheckCircle2, XCircle, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';
import { api } from '../api/api';

export default function QuizSection({ 
  studentId, 
  topicId, 
  chapterId, 
  isChapterTest = false,
  questions = [], 
  onSuccess, // Callback on pass
  onClose    // Callback to close/reset
}) {
  const [answers, setAnswers] = useState({}); // Stores question_id -> answer string
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null); // Stores submission response
  const [error, setError] = useState("");

  const handleSelectOption = (questionId, optionKey) => {
    if (result) return; // Prevent edits after submission
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionKey
    }));
  };

  const handleTextChange = (questionId, value) => {
    if (result) return;
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async () => {
    // Validate that all questions have some input
    const uncompleted = questions.filter(q => !answers[q.id]);
    if (uncompleted.length > 0) {
      setError(`Please answer all ${questions.length} questions before submitting.`);
      return;
    }

    setError("");
    setIsSubmitting(true);

    const answersPayload = Object.keys(answers).map(qId => ({
      question_id: Number(qId),
      answer: answers[qId]
    }));

    try {
      let res;
      if (isChapterTest) {
        res = await api.submitChapterTest(studentId, chapterId, answersPayload);
      } else {
        res = await api.submitTopicQuiz(studentId, topicId, answersPayload);
      }

      if (res.success || res.passed !== undefined) {
        setResult(res);
        if (res.passed && onSuccess) {
          onSuccess(res.percentage);
        }
      } else {
        throw new Error(res.message || "Failed to grade quiz.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong during evaluation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setResult(null);
    setError("");
  };

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm text-center">
        <p className="text-slate-500 font-medium font-display">No questions available for this evaluation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Results Summary Panel (Shown after grading) */}
      {result && (
        <div className={`rounded-2xl p-6 border relative overflow-hidden animate-fade-in-up ${
          result.passed 
            ? 'bg-emerald-50/60 border-emerald-100' 
            : 'bg-red-50/40 border-red-100'
        }`}
          style={result.passed ? { boxShadow: '0 8px 32px -8px rgba(16,185,129,0.2)' } : { boxShadow: '0 8px 32px -8px rgba(239,68,68,0.15)' }}>

          {/* Background glow orb */}
          <div className={`absolute top-0 right-0 w-48 h-48 rounded-full opacity-30 pointer-events-none`}
            style={{ background: result.passed ? 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(239,68,68,0.1) 0%, transparent 70%)' }} />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl shrink-0 relative overflow-hidden ${result.passed ? 'bg-emerald-500' : 'bg-red-500'}`}
                style={result.passed ? { boxShadow: '0 8px 20px rgba(16,185,129,0.4)' } : { boxShadow: '0 8px 20px rgba(239,68,68,0.35)' }}>
                <div className="absolute inset-0 shimmer-bg opacity-40" />
                {result.passed ? <Award className="w-7 h-7 text-white relative z-10" /> : <AlertTriangle className="w-7 h-7 text-white relative z-10" />}
              </div>
              <div className="space-y-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider font-display ${
                  result.passed ? 'bg-emerald-100 border-emerald-200 text-emerald-700' : 'bg-red-100 border-red-200 text-red-700'
                }`}>
                  {result.passed ? 'Passed' : 'Failed'}
                </span>
                <h3 className="text-xl font-bold font-display tracking-tight">
                  {result.passed ? 'Excellent Work!' : 'Keep Learning!'}
                </h3>
                <p className="text-sm font-medium opacity-90 leading-relaxed">
                  {result.message}
                </p>
              </div>
            </div>

            {/* Score circle */}
            <div className="flex items-center gap-4 border-l border-slate-200/50 pl-0 md:pl-6">
              <div className="text-center">
                <p className="text-3xl font-extrabold font-display leading-none text-slate-800">
                  {result.obtained_marks}<span className="text-sm font-semibold text-slate-400">/{result.total_marks}</span>
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Score Marks</p>
              </div>
              <div className="text-center bg-white/80 backdrop-blur-sm border border-slate-100 p-2.5 rounded-xl">
                <p className="text-lg font-bold font-display text-slate-700">{result.percentage}%</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Percentage</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {!result.passed && (
              <button
                onClick={handleRetry}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Quiz
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm shadow-slate-950/10"
              >
                Continue Course
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2.5 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {/* 3. Questions Panel */}
      <div className="space-y-6">
        {questions.map((question, index) => {
          const selectedAnswer = answers[question.id];
          const questionResult = result?.details?.find(d => d.question_id === question.id);
          const isCorrect = questionResult ? questionResult.obtained_marks > 0 : null;

          return (
            <div 
              key={question.id} 
              className={`bg-white rounded-2xl p-6 border transition-all duration-300 ${
                result 
                  ? isCorrect 
                    ? 'border-emerald-200/80 shadow-emerald-50/10' 
                    : 'border-red-200/80 shadow-red-50/10'
                  : 'border-slate-100 shadow-sm'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-display">
                    Question {index + 1} ({question.marks} {question.marks === 1 ? 'Mark' : 'Marks'})
                  </span>
                  <h4 className="text-base font-bold text-slate-800 font-display leading-snug">
                    {question.question}
                  </h4>
                </div>

                {/* Question grading status */}
                {result && (
                  <div className="shrink-0 pt-1">
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 uppercase tracking-wider font-display">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Correct
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-100 uppercase tracking-wider font-display">
                        <XCircle className="w-3.5 h-3.5 text-red-500" /> Incorrect
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* MCQ & True/False options layout */}
              {(question.question_type === 'mcq' || question.question_type === 'true_false') ? (
                <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 mt-4">
                  {['A', 'B', 'C', 'D'].map(optKey => {
                    const optLabel = question[`option_${optKey.toLowerCase()}`];
                    // Skip C and D for True/False if they are empty
                    if (!optLabel) return null;

                    const isSelected = selectedAnswer === optKey;
                    const isCorrectOption = questionResult?.correct_answer?.toUpperCase() === optKey;

                    return (
                      <button
                        key={optKey}
                        type="button"
                        onClick={() => handleSelectOption(question.id, optKey)}
                        disabled={!!result}
                        className={`p-4 rounded-xl border-2 text-left font-medium text-sm transition-all duration-200 flex items-center justify-between gap-3 ${
                          result
                            ? isSelected
                              ? isCorrect
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                                : 'bg-red-50 border-red-500 text-red-900'
                              : isCorrectOption
                                ? 'bg-emerald-50 border-emerald-400 text-emerald-900 border-dashed'
                                : 'bg-slate-50 border-slate-100 text-slate-400'
                            : isSelected
                              ? 'bg-primary-50 border-primary-500 text-primary-900 shadow-sm scale-[1.01]'
                              : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-200 hover:scale-[1.005]'
                        }`}
                        style={isSelected && !result ? { boxShadow: '0 4px 16px rgba(79,117,247,0.15)' } : {}}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                            isSelected 
                              ? 'bg-primary-500 text-white' 
                              : 'bg-slate-100 text-slate-500'
                          }`}>
                            {optKey}
                          </span>
                          <span>{optLabel}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Short answer text area */
                <div className="space-y-3 mt-4">
                  <textarea
                    rows={3}
                    disabled={!!result}
                    value={selectedAnswer || ""}
                    onChange={(e) => handleTextChange(question.id, e.target.value)}
                    placeholder="Type your explanation/answer here..."
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary-400 rounded-xl py-3 px-4 text-sm font-medium text-slate-700 focus:outline-none disabled:bg-slate-100 disabled:text-slate-500 leading-relaxed"
                  />

                  {/* Grading breakdown for typed responses */}
                  {result && questionResult && (
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Expected Answer Keywords</span>
                        <p className="text-xs font-semibold text-slate-600 mt-1 leading-relaxed whitespace-pre-line">
                          {questionResult.correct_answer}
                        </p>
                      </div>
                      
                      {questionResult.feedback && (
                        <div className="pt-2 border-t border-slate-200/50">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">AI Evaluator Feedback</span>
                          <p className="text-xs font-semibold text-slate-600 mt-1 italic leading-relaxed">
                            "{questionResult.feedback}"
                          </p>
                        </div>
                      )}
                      
                      <div className="pt-2 border-t border-slate-200/50 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Evaluation Marks:</span>
                        <span className="text-xs font-bold text-slate-700">
                          {questionResult.obtained_marks} / {questionResult.marks} Marks
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. Submission Button */}
      {!result && (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-3.5 text-white rounded-xl font-bold transition-all relative overflow-hidden group disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #4f75f7, #6366f1)', boxShadow: '0 8px 24px -6px rgba(79,117,247,0.45)' }}
          onMouseEnter={e => { if (!isSubmitting) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 12px 32px -6px rgba(79,117,247,0.55)'; } }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 24px -6px rgba(79,117,247,0.45)'; }}
        >
          <div className="absolute inset-0 shimmer-bg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="relative z-10">{isSubmitting ? 'Evaluating Quiz Answers...' : 'Submit Evaluation Answers'}</span>
        </button>
      )}
    </div>
  );
}
