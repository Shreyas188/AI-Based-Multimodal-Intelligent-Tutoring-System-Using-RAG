import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send, Sparkles, AlertCircle, Bot, User,
  Mic, MicOff, Volume2, VolumeX, Square, Loader2
} from 'lucide-react';
import { api } from '../api/api';
import { cleanDoubtAnswer } from '../utils/formatters';

// ─── Offline TTS Helper ────────────────────────────────────────────────────────
// Normalizes physics formula text before speaking so it sounds more natural.
function normalizeTTSText(text) {
  return text
    .replace(/q\s*=\s*ne/gi, 'q equals n times e')
    .replace(/ε0/g, 'epsilon naught')
    .replace(/∈0/g, 'epsilon naught')
    .replace(/μ0/g, 'mu naught')
    .replace(/r²/g, 'r squared')
    .replace(/m²/g, 'm squared')
    .replace(/c²/g, 'c squared')
    .replace(/×/g, 'times')
    .replace(/÷/g, 'divided by')
    .replace(/≈/g, 'approximately equals')
    .replace(/\^2/g, ' squared')
    .replace(/\^3/g, ' cubed')
    .replace(/1\.6\s*×\s*10\^?-?19/g, '1.6 times 10 to the power minus 19')
    .replace(/9\s*×\s*10\^?9/g, '9 times 10 to the power 9');
}

function speakText(text, onEnd) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(normalizeTTSText(text));
  utter.lang = 'en-US';
  utter.rate = 0.95;
  utter.pitch = 1.05;
  // Prefer a local offline voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(
    v => v.localService && v.lang.startsWith('en')
  );
  if (preferred) utter.voice = preferred;
  if (onEnd) utter.onend = onEnd;
  window.speechSynthesis.speak(utter);
}

function stopSpeaking() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function DoubtChatbot({ studentId, topicId, topicTitle }) {
  const [question, setQuestion]           = useState('');
  const [chatHistory, setChatHistory]     = useState([]);
  const [isLoading, setIsLoading]         = useState(false);
  const [error, setError]                 = useState('');

  // Mic / recording state
  const [isRecording, setIsRecording]     = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  // TTS state
  const [autoVoice, setAutoVoice]         = useState(true);   // global toggle
  const [speakingIndex, setSpeakingIndex] = useState(null);   // index of message being spoken

  // Flags & refs
  const micUsedRef      = useRef(false);  // was the latest question sent via mic?
  const mediaRecorderRef = useRef(null);
  const audioChunksRef  = useRef([]);
  const chatEndRef      = useRef(null);

  // Scroll to bottom when chat updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  // ── Core: send question + get AI answer ─────────────────────────────────────
  const sendQuestion = useCallback(async (text, viaVoice = false) => {
    if (!text.trim()) return;

    micUsedRef.current = viaVoice;
    stopSpeaking();
    setSpeakingIndex(null);

    const userMsg = {
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistory(prev => [...prev, userMsg]);
    setIsLoading(true);
    setError('');

    try {
      const response = await api.askDoubt(studentId, topicId, text.trim());

      if (response.success) {
        const clean = cleanDoubtAnswer(response.answer);
        const botMsg = {
          sender: 'bot',
          text: clean,
          sources: response.sources || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setChatHistory(prev => {
          const next = [...prev, botMsg];
          const newIndex = next.length - 1;

          // Auto-speak: only if question was via mic AND autoVoice is on
          if (viaVoice && autoVoice) {
            setSpeakingIndex(newIndex);
            speakText(clean, () => setSpeakingIndex(null));
          }

          return next;
        });
      } else {
        throw new Error(response.message || 'Failed to get an answer.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong while connecting to the AI Tutor.');
    } finally {
      setIsLoading(false);
    }
  }, [studentId, topicId, autoVoice]);

  // ── Offline MediaRecorder mic ────────────────────────────────────────────────
  const startRecording = useCallback(async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';
      const recorder = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];

      recorder.ondataavailable = e => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        // Stop all mic tracks so the red indicator in the browser goes away
        stream.getTracks().forEach(t => t.stop());

        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        if (blob.size < 1000) {
          setError('Recording was too short. Please speak clearly and try again.');
          setIsTranscribing(false);
          return;
        }

        setIsTranscribing(true);
        try {
          const result = await api.transcribeAudio(blob);
          const transcript = result.text?.trim();
          if (transcript) {
            sendQuestion(transcript, true /* viaVoice */);
          } else {
            setError('Could not detect any speech. Please try again.');
          }
        } catch (err) {
          console.error('[STT Error]', err);
          setError('Voice transcription failed. Make sure the backend is running.');
        } finally {
          setIsTranscribing(false);
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      console.error('[Mic Error]', err);
      setError('Microphone access denied. Please allow microphone permission in your browser.');
    }
  }, [sendQuestion]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  const toggleMic = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  // ── Per-message TTS controls ─────────────────────────────────────────────────
  const handleListenMessage = useCallback((index, text) => {
    if (speakingIndex === index) {
      // Already speaking this message → stop it
      stopSpeaking();
      setSpeakingIndex(null);
    } else {
      stopSpeaking();
      setSpeakingIndex(index);
      speakText(text, () => setSpeakingIndex(null));
    }
  }, [speakingIndex]);

  // ── Text submit ──────────────────────────────────────────────────────────────
  const handleSubmit = e => {
    e?.preventDefault();
    if (!question.trim()) return;
    sendQuestion(question, false /* typed, not voice */);
    setQuestion('');
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  const micBusy = isRecording || isTranscribing;

  return (
    <div className="bg-white rounded-2xl border border-slate-100/80 shadow-sm flex flex-col h-[540px] overflow-hidden animate-fade-in-up"
      style={{ boxShadow: '0 4px 24px -8px rgba(79,117,247,0.1), 0 1px 4px rgba(15,23,42,0.04)' }}>

      {/* ── Header ── */}
      <div className="p-4 text-white flex items-center justify-between relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #3b55ed 0%, #4f75f7 50%, #6366f1 100%)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)' }} />
        <div className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
            <Sparkles className="w-4.5 h-4.5 text-white animate-pulse" />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-bold font-display leading-tight">AI Physics Doubt Solver</h4>
            <p className="text-[10px] font-medium" style={{ color: 'rgba(199,210,254,0.9)' }}>Topic: {topicTitle}</p>
          </div>
        </div>

        {/* Global Auto-Voice Toggle */}
        <button
          type="button"
          onClick={() => {
            setAutoVoice(v => !v);
            stopSpeaking();
            setSpeakingIndex(null);
          }}
          title={autoVoice ? 'Auto-Voice ON — click to mute' : 'Auto-Voice OFF — click to enable'}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
            autoVoice
              ? 'bg-white/15 border-white/20 text-white hover:bg-white/25'
              : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/15'
          }`}
        >
          {autoVoice ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          {autoVoice ? 'Voice On' : 'Voice Off'}
        </button>
      </div>

      {/* ── Message Area ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">

          {chatHistory.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center animate-glow-pulse"
                style={{ background: 'linear-gradient(135deg, rgba(79,117,247,0.1), rgba(99,102,241,0.08))', border: '1px solid rgba(79,117,247,0.12)' }}>
                <Bot className="w-8 h-8" style={{ color: '#4f75f7' }} />
              </div>
              <div className="space-y-1.5">
                <h5 className="text-sm font-bold text-slate-700 font-display">Stuck on a concept?</h5>
                <p className="text-xs max-w-xs text-slate-400 font-medium leading-relaxed">
                  Type your doubt below, or click the 🎙️ mic and speak it aloud.
                  The AI Tutor will answer — and can read the answer back to you!
                </p>
              </div>
            </div>
          )}

          {chatHistory.map((msg, index) => {
            const isUser = msg.sender === 'user';
            const isBeingSpoken = speakingIndex === index;
            return (
              <div
                key={index}
                className={`flex gap-2.5 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse chat-bubble-user' : 'mr-auto chat-bubble-bot'}`}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm ${
                  isUser
                    ? 'bg-gradient-to-tr from-indigo-500 to-violet-500'
                    : 'bg-gradient-to-tr from-primary-500 to-indigo-600'
                }`}
                  style={isUser ? { boxShadow: '0 4px 12px rgba(99,102,241,0.3)' } : { boxShadow: '0 4px 12px rgba(79,117,247,0.3)' }}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div className="space-y-1 min-w-0">
                  <div className={`p-3.5 rounded-2xl text-sm font-medium leading-relaxed ${
                    isUser
                      ? 'text-white rounded-tr-none'
                      : 'bg-white text-slate-700 border border-slate-100/80 rounded-tl-none'
                  }`}
                    style={isUser
                      ? { background: 'linear-gradient(135deg, #4f55f0, #6366f1)', boxShadow: '0 4px 16px rgba(99,102,241,0.25)' }
                      : { boxShadow: '0 2px 12px rgba(15,23,42,0.06)' }}
                  >
                  {msg.text}

                  {/* RAG Source chips */}
                  {!isUser && msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-1 items-center">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mr-1">RAG Context:</span>
                      {msg.sources.map((src, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[9px] bg-slate-50 border border-slate-200/60 text-slate-500 px-1.5 py-0.5 rounded font-mono font-medium"
                        >
                          Page {src.page}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Per-message 🔊 Listen / ⏹️ Stop button */}
                  {!isUser && (
                    <div className="mt-2.5 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleListenMessage(index, msg.text)}
                        title={isBeingSpoken ? 'Stop speaking' : 'Listen to this answer'}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          isBeingSpoken
                            ? 'bg-red-100 text-red-600 hover:bg-red-200 animate-pulse'
                            : 'bg-slate-100 text-slate-500 hover:bg-primary-100 hover:text-primary-600'
                        }`}
                      >
                        {isBeingSpoken
                          ? <><Square className="w-3 h-3" /> Stop</>
                          : <><Volume2 className="w-3 h-3" /> Listen</>
                        }
                      </button>
                    </div>
                  )}
                </div>
                <span className={`text-[9px] text-slate-400 font-medium block ${isUser ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* Thinking / Loading dots */}
        {isLoading && (
          <div className="flex gap-2.5 max-w-[85%] mr-auto chat-bubble-bot">
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm"
              style={{ background: 'linear-gradient(135deg, #4f75f7, #6366f1)', boxShadow: '0 4px 12px rgba(79,117,247,0.3)' }}>
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="bg-white border border-slate-100/80 p-4 rounded-2xl rounded-tl-none flex items-center gap-1.5"
                style={{ boxShadow: '0 2px 12px rgba(15,23,42,0.06)' }}>
                <span className="typing-dot w-2 h-2 rounded-full" style={{ background: '#4f75f7' }} />
                <span className="typing-dot w-2 h-2 rounded-full" style={{ background: '#6366f1' }} />
                <span className="typing-dot w-2 h-2 rounded-full" style={{ background: '#8b5cf6' }} />
              </div>
            </div>
          </div>
        )}

        {/* Error alert */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2.5 text-red-700 text-xs">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Query Failed</p>
              <p className="opacity-90">{error}</p>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* ── Recording Banner ── */}
      {isRecording && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-100 flex items-center gap-2 text-red-600 text-xs font-semibold animate-pulse">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
          Recording… Click the mic again to stop and send.
        </div>
      )}
      {isTranscribing && (
        <div className="px-4 py-2 bg-amber-50 border-t border-amber-100 flex items-center gap-2 text-amber-700 text-xs font-semibold">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Transcribing your voice offline…
        </div>
      )}

      {/* ── Input Tray ── */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-slate-100 bg-white flex items-center gap-2">
        <textarea
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder={
            isRecording
              ? '🎙️ Recording… click mic to stop'
              : isTranscribing
                ? '⏳ Transcribing voice…'
                : 'Ask AI Doubt Solver…'
          }
          rows={1}
          disabled={micBusy}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          className={`flex-1 resize-none bg-slate-50 border rounded-xl py-2 px-3 text-sm font-medium text-slate-700 focus:outline-none max-h-24 scrollbar-none transition-all ${
            isRecording
              ? 'border-red-300 ring-2 ring-red-100 placeholder-red-400'
              : isTranscribing
                ? 'border-amber-300 ring-2 ring-amber-100 placeholder-amber-500'
                : 'border-slate-200 focus:border-primary-400 focus:bg-white'
          }`}
        />

        {/* 🎙️ Offline Mic Button */}
        <button
          type="button"
          onClick={toggleMic}
          disabled={isLoading || isTranscribing}
          title={isRecording ? 'Stop Recording & Send' : 'Speak your doubt (Offline)'}
          className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-all ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/20 animate-pulse'
              : isTranscribing
                ? 'bg-amber-400 text-white cursor-wait'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200/60 hover:border-primary-300 hover:text-primary-600'
          }`}
        >
          {isTranscribing
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : isRecording
              ? <MicOff className="w-4 h-4" />
              : <Mic className="w-4 h-4" />
          }
        </button>

        {/* Send Button */}
        <button
          type="submit"
          disabled={isLoading || micBusy || !question.trim()}
          className="w-10 h-10 shrink-0 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-xl flex items-center justify-center transition-all shadow-md shadow-primary-500/10 hover:shadow-primary-600/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
