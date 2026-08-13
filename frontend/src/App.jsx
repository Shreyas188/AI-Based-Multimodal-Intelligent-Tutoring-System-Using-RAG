import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ChapterPage from './pages/ChapterPage';
import StudyPage from './pages/StudyPage';
import ProgressPanel from './components/ProgressPanel';
import LoadingSpinner from './components/LoadingSpinner';
import ChapterCard from './components/ChapterCard';
import { api } from './api/api';
import { Sparkles, X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function App() {
  const [student, setStudent] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [activePage, setActivePage] = useState("dashboard"); // 'dashboard', 'chapters', 'progress'
  
  // Drill-down states
  const [activeChapterId, setActiveChapterId] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  
  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Toast notifier helper
  const addToast = (message, type = "success") => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);

    // Auto dismiss
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Restore session from localStorage on mount
  useEffect(() => {
    const cachedStudent = localStorage.getItem("student");
    if (cachedStudent) {
      try {
        const parsed = JSON.parse(cachedStudent);
        if (parsed && parsed.id) {
          setStudent(parsed);
        }
      } catch (e) {
        console.error("Corrupted local storage student data", e);
        localStorage.removeItem("student");
      }
    }
    setIsLoading(false);
  }, []);

  // Fetch progress whenever student changes
  const fetchProgress = async (studentId) => {
    if (!studentId) return;
    try {
      const data = await api.getProgress(studentId);
      setProgressData(data);
    } catch (err) {
      console.error("Failed to load student progress data:", err);
      addToast("Failed to connect to backend server. Verify it is running on port 8000.", "error");
    }
  };

  useEffect(() => {
    if (student?.id) {
      fetchProgress(student.id);
    } else {
      setProgressData(null);
    }
  }, [student]);

  const handleLoginSuccess = (userData) => {
    const studentInfo = {
      student_id: userData.id,
      student_name: userData.full_name,
      email: userData.email,
      id: userData.id // helper field
    };
    localStorage.setItem("student", JSON.stringify(studentInfo));
    setStudent(studentInfo);
    setActivePage("dashboard");
    setActiveChapterId(null);
    setActiveTopic(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("student");
    setStudent(null);
    setProgressData(null);
    addToast("Logged out successfully.", "info");
  };

  const handleSelectChapter = (chapterId) => {
    setActiveChapterId(chapterId);
    setActiveTopic(null);
    setActivePage("chapters");
  };

  const handleStudyTopic = (topic) => {
    setActiveTopic(topic);
    setActivePage("study");
  };

  const handleContinueLearning = (chapterId, topic) => {
    setActiveChapterId(chapterId);
    setActiveTopic(topic);
    setActivePage("study");
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-900">
        <LoadingSpinner message="Booting offline learning client..." />
      </div>
    );
  }

  // If not logged in, render AuthPage
  if (!student) {
    return (
      <>
        <AuthPage onLoginSuccess={handleLoginSuccess} addToast={addToast} />
        {/* Toast stack overlay */}
        <ToastOverlay toasts={toasts} removeToast={removeToast} />
      </>
    );
  }

  // Pages switcher router logic
  const renderPageContent = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <Dashboard 
            progressData={progressData} 
            onSelectChapter={handleSelectChapter}
            onContinueLearning={handleContinueLearning}
          />
        );
      case 'chapters':
        if (activeChapterId) {
          return (
            <ChapterPage 
              studentId={student.student_id}
              chapterId={activeChapterId}
              onBack={() => {
                setActiveChapterId(null);
                setActivePage("chapters");
              }}
              onStudyTopic={handleStudyTopic}
              refreshProgress={() => fetchProgress(student.student_id)}
              addToast={addToast}
            />
          );
        }
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-display">Course Curriculum</span>
                <h2 className="text-xl font-bold font-display text-slate-800 tracking-tight">Chapters Directory</h2>
              </div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider hidden sm:inline">
                Select a chapter to begin learning
              </span>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {progressData?.progress?.map(chData => (
                <ChapterCard
                  key={chData.chapter.id}
                  chapter={chData.chapter}
                  onClick={() => handleSelectChapter(chData.chapter.id)}
                  completedTopics={chData.completed_topics}
                  totalTopics={chData.total_topics}
                  progressPercentage={chData.progress_percentage}
                />
              ))}
            </div>
          </div>
        );
      case 'study':
        if (activeTopic && activeChapterId) {
          return (
            <StudyPage
              studentId={student.student_id}
              topicId={activeTopic.id}
              chapterId={activeChapterId}
              onBack={() => {
                // Return to the active chapter screen
                setActiveTopic(null);
                setActivePage("chapters");
              }}
              refreshProgress={() => fetchProgress(student.student_id)}
              addToast={addToast}
            />
          );
        }
        return <Dashboard progressData={progressData} onSelectChapter={handleSelectChapter} />;
      case 'progress':
        return <ProgressPanel progressData={progressData} />;
      default:
        return <Dashboard progressData={progressData} onSelectChapter={handleSelectChapter} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      
      {/* Sidebar navigation */}
      <Sidebar 
        activePage={activePage}
        setActivePage={(page) => {
          setActivePage(page);
          setActiveChapterId(null);
          setActiveTopic(null);
        }}
        isMobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        onLogout={handleLogout}
      />

      {/* Main viewport */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Navbar */}
        <Navbar 
          student={student} 
          progressData={progressData}
          activePage={activePage}
          onLogout={handleLogout}
          toggleMobileSidebar={() => setMobileSidebarOpen(prev => !prev)}
          onNavigateProgress={() => {
            setActivePage("progress");
            setActiveChapterId(null);
            setActiveTopic(null);
          }}
        />

        {/* Scrollable page body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderPageContent()}
        </main>
      </div>

      {/* Floating notification stack */}
      <ToastOverlay toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

// Internal component for Toast displays
function ToastOverlay({ toasts, removeToast }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        let themeClasses = "bg-white border-slate-100 text-slate-700 shadow-slate-200/50";
        let Icon = Info;
        let iconColor = "text-primary-500";

        if (toast.type === 'success') {
          themeClasses = "bg-white border-emerald-100 text-slate-800 shadow-emerald-200/20";
          Icon = CheckCircle;
          iconColor = "text-emerald-500";
        } else if (toast.type === 'error') {
          themeClasses = "bg-white border-red-100 text-slate-800 shadow-red-200/20";
          Icon = AlertCircle;
          iconColor = "text-red-500";
        }

        return (
          <div
            key={toast.id}
            className={`p-4 rounded-2xl border shadow-xl flex items-start justify-between gap-3 pointer-events-auto animate-physics-float ${themeClasses}`}
            style={{ animationDuration: '4s' }}
          >
            <div className="flex items-start gap-2.5">
              <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
              <p className="text-xs font-semibold leading-relaxed">
                {toast.message}
              </p>
            </div>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="p-0.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
