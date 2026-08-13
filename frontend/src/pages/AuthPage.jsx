import React, { useState } from 'react';
import { api } from '../api/api';
import { GraduationCap, Mail, Lock, User, Sparkles, ArrowRight, ShieldAlert } from 'lucide-react';

export default function AuthPage({ onLoginSuccess, addToast }) {
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please fill in all credentials.");
      return;
    }
    if (isRegister && !fullName.trim()) {
      setErrorMsg("Please enter your name to register.");
      return;
    }

    setErrorMsg("");
    setIsLoading(true);

    try {
      if (isRegister) {
        const response = await api.registerStudent(fullName.trim(), email.trim(), password);
        if (response.success && response.user) {
          addToast("Registration successful! Logging in...", "success");
          onLoginSuccess(response.user);
        } else {
          setErrorMsg(response.message || "Registration failed.");
          addToast(response.message || "Registration failed.", "error");
        }
      } else {
        const response = await api.loginStudent(email.trim(), password);
        if (response.success && response.user) {
          addToast("Login successful!", "success");
          onLoginSuccess(response.user);
        } else {
          setErrorMsg(response.message || "Invalid credentials.");
          addToast(response.message || "Invalid credentials.", "error");
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Failed to reach server. Verify backend is running.");
      addToast(err.message || "Server connection error.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setErrorMsg("");
    setFullName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      
      {/* 1. Left Side: Brand Showcase */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between relative overflow-hidden mesh-bg">
        
        {/* Animated floating physics symbols */}
        {['⚛', 'E', 'F', 'q', '∫', 'Φ', 'B', 'λ'].map((sym, i) => (
          <div key={i}
            className="absolute text-white/5 font-display font-bold select-none pointer-events-none animate-physics-float"
            style={{
              fontSize: `${Math.random() * 40 + 20}px`,
              top: `${(i * 13) % 90}%`,
              left: `${(i * 17 + 5) % 85}%`,
              animationDuration: `${6 + i * 1.3}s`,
              animationDelay: `${i * 0.7}s`
            }}
          >{sym}</div>
        ))}

        {/* Glow Spheres */}
        <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] bg-primary-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-violet-500/8 rounded-full blur-[80px]" />

        {/* Branding header */}
        <div className="flex items-center gap-2.5 z-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #4f75f7, #6366f1)', boxShadow: '0 8px 24px rgba(79,117,247,0.35)' }}>
            <GraduationCap className="w-6 h-6 text-white relative z-10" />
            <div className="absolute inset-0 shimmer-bg opacity-40" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold font-display tracking-tight text-white uppercase">Physics Tutor</h2>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Offline Learning Platform</span>
          </div>
        </div>

        {/* Orbit Animation Visual */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 py-12">
          <div className="relative w-72 h-72 flex items-center justify-center">
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full animate-glow-pulse" />
            {/* Outer dotted orbit */}
            <div className="absolute inset-0 rounded-full border border-dashed border-slate-600/50 animate-spin" style={{ animationDuration: '24s' }} />
            {/* Middle solid orbit */}
            <div className="absolute inset-8 rounded-full border border-slate-600/30 animate-spin" style={{ animationDuration: '16s', animationDirection: 'reverse' }} />
            {/* Inner orbit */}
            <div className="absolute inset-16 rounded-full border border-slate-500/25 animate-spin" style={{ animationDuration: '8s' }} />
            
            {/* Orbiting particles with glow */}
            <div className="absolute top-0 w-3 h-3 rounded-full animate-physics-float" style={{ background: '#4f75f7', boxShadow: '0 0 12px rgba(79,117,247,0.8)' }} />
            <div className="absolute right-8 w-2 h-2 rounded-full animate-physics-float" style={{ background: '#818cf8', boxShadow: '0 0 8px rgba(129,140,248,0.8)', animationDelay: '1s' }} />
            <div className="absolute bottom-16 w-2.5 h-2.5 rounded-full animate-physics-float" style={{ background: '#fb923c', boxShadow: '0 0 10px rgba(251,146,60,0.7)', animationDelay: '2s' }} />

            {/* Core Nucleus */}
            <div className="absolute inset-[100px] rounded-full flex flex-col items-center justify-center border border-white/10"
              style={{ background: 'linear-gradient(135deg, #4f75f7, #6366f1)', boxShadow: '0 0 40px 8px rgba(79,117,247,0.4), 0 0 80px 16px rgba(79,117,247,0.15)' }}>
              <span className="font-display font-extrabold text-2xl text-white">12th</span>
              <span className="text-[9px] font-bold text-primary-100 uppercase tracking-widest leading-none">Class</span>
            </div>
          </div>

          <div className="text-center mt-8 space-y-3 max-w-sm">
            <h3 className="text-xl font-bold font-display text-white tracking-tight">
              Class 12 CBSE Board Exam Prep
            </h3>
            <p className="text-sm font-medium text-slate-400 leading-relaxed">
              Unlock concepts topic-by-topic, verify with AI doubts, and pass interactive quizzes to progress.
            </p>
          </div>
        </div>

        {/* Footer info tag */}
        <div className="text-xs font-semibold text-slate-500 z-10 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-primary-400" /> Fully functional offline learning sandbox
        </div>
      </div>

      {/* 2. Right Side: Card Authenticator Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12" style={{ background: 'linear-gradient(135deg, rgba(248,250,252,1) 0%, rgba(241,245,249,0.6) 100%)' }}>
        <div className="w-full max-w-md space-y-8 bg-white/90 p-8 md:p-10 rounded-3xl animate-fade-in-up" style={{ border: '1px solid rgba(226,232,240,0.8)', boxShadow: '0 24px 64px -16px rgba(79,117,247,0.1), 0 4px 24px -4px rgba(15,23,42,0.06)', backdropFilter: 'blur(12px)' }}>
          
          {/* Mobile branding view */}
          <div className="lg:hidden flex items-center gap-3 justify-center mb-6">
            <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center shadow-md text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h2 className="text-base font-extrabold font-display text-slate-800 tracking-tight uppercase">Physics Tutor</h2>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold font-display text-slate-800 tracking-tight">
              {isRegister ? 'Create student account' : 'Welcome back, student!'}
            </h1>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              {isRegister ? 'Sign up to build your physics progress' : 'Enter details to continue learning'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Form Error alert */}
            {errorMsg && (
              <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2.5 text-red-700 text-xs">
                <ShieldAlert className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Authentication Error</p>
                  <p className="opacity-95 mt-0.5">{errorMsg}</p>
                </div>
              </div>
            )}

            {isRegister && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="E.g., John Doe"
                    className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-primary-400 rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-slate-700 focus:outline-none transition-all duration-200"
                    style={{ '--tw-ring-color': 'rgba(79,117,247,0.2)' }}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@school.com"
                  className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-primary-400 rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-slate-700 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-primary-400 rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-slate-700 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 group relative overflow-hidden disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #4f75f7, #6366f1)', boxShadow: '0 8px 24px -6px rgba(79,117,247,0.45)' }}
              onMouseEnter={e => { if (!isLoading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
            >
              <div className="absolute inset-0 shimmer-bg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {isLoading ? (
                'Connecting to Server...'
              ) : (
                <>
                  {isRegister ? 'Register Student' : 'Log In to Dashboard'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Toggle buttons */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={toggleMode}
              className="text-xs font-bold text-indigo-500 hover:text-indigo-600 hover:underline transition-all uppercase tracking-wider"
            >
              {isRegister ? 'Already registered? Log in' : 'New student? Register here'}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
