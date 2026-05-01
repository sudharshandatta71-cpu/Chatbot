import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Loader2, Trash2, History, Plus, MessageSquare, Calendar, Clock, Send, User as UserIcon } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { SCHEDULE_INSTRUCTION, TRANSLATIONS } from '../constants';
import { Message, ChatSession, User as UserType, AppLanguage } from '../types';

interface ScheduleGeneratorProps {
  theme: 'light' | 'dark';
  user: UserType;
  language: AppLanguage;
}

const ScheduleGenerator: React.FC<ScheduleGeneratorProps> = ({ theme, user, language }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [describe, setDescribe] = useState('');
  const [timeRange, setTimeRange] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[language] || TRANSLATIONS['ENGLISH'];

  useEffect(() => {
    if (user.id !== -1) {
      fetchSessions();
    }
  }, [user.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/chat/history?type=SCHEDULE_GENERATOR', {
        headers: { Authorization: `Bearer ${localStorage.getItem('cb_token')}` },
      });
      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const startNewSession = () => {
    setCurrentSessionId(Date.now().toString());
    setMessages([]);
    setDescribe('');
    setTimeRange('');
  };

  const loadSession = async (sessionId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/chat/history/${sessionId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('cb_token')}` },
      });
      const data = await response.json();
      setMessages(data.messages.map((m: any, i: number) => ({
        id: `${sessionId}-${i}`,
        role: m.role,
        text: m.text,
        timestamp: new Date(m.timestamp).getTime(),
      })));
      setCurrentSessionId(sessionId);
      setShowHistory(false);
    } catch (error) {
      console.error('Error loading session:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (sessionId: string) => {
    if (!window.confirm('Delete this schedule?')) return;
    try {
      const response = await fetch(`/api/chat/history/${sessionId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('cb_token')}` },
      });
      if (response.ok) {
        if (currentSessionId === sessionId) startNewSession();
        fetchSessions();
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const saveMessage = async (role: string, text: string) => {
    if (user.isGuest) return;
    try {
      await fetch('/api/chat/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('cb_token')}`,
        },
        body: JSON.stringify({ sessionId: currentSessionId || Date.now().toString(), role, text, type: 'SCHEDULE_GENERATOR' }),
      });
      fetchSessions();
    } catch (error) {
      console.error('Failed to save message:', error);
    }
  };

  const handleGenerate = async () => {
    if (!describe.trim() || !timeRange.trim() || loading) return;

    setLoading(true);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: `Description: ${describe}\nTime Range: ${timeRange}`,
      timestamp: Date.now()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            parts: [
              { text: SCHEDULE_INSTRUCTION },
              { text: `Preferred Language: ${language}` },
              { text: `User Description: ${describe}` },
              { text: `Time Range: ${timeRange}` },
              { text: "Please generate a smart and perfect schedule based on the above information." }
            ]
          }
        ]
      });

      const response = await model;
      const aiResponse = response.text || "Sorry, I couldn't generate a schedule for this.";

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: aiResponse,
        timestamp: Date.now()
      };

      setMessages((prev) => [...prev, botMessage]);
      await saveMessage('user', userMessage.text);
      await saveMessage('model', aiResponse);
    } catch (error) {
      console.error('Schedule generation error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "An error occurred while generating the schedule.",
        timestamp: Date.now()
      }]);
    } finally {
      setLoading(false);
      setDescribe('');
      setTimeRange('');
    }
  };

  return (
    <div className={`flex flex-col h-[calc(100vh-80px)] ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-[#D4AF37]" />
          <h2 className="text-xl font-bold tracking-tight">{t.SCHEDULE_GENERATOR}</h2>
        </div>
        <div className="flex items-center gap-2">
          {user.id !== -1 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <History className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={startNewSession}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
          {messages.length > 0 && (
            <button
              onClick={() => currentSessionId && deleteSession(currentSessionId)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-red-500"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* History Sidebar */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="w-72 border-r border-white/10 bg-black/20 overflow-y-auto"
            >
              <div className="p-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider opacity-50 mb-4">{t.CHAT_HISTORY}</h3>
                <div className="space-y-2">
                  {sessions.map((session) => (
                    <div
                      key={session.session_id}
                      onClick={() => loadSession(session.session_id)}
                      className={`group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                        currentSessionId === session.session_id
                          ? 'bg-gold/10 border-gold/30 text-gold'
                          : theme === 'dark'
                            ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                            : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                      }`}
                    >
                      <MessageSquare className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                      <span className="truncate text-sm flex-1">{session.first_msg}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(session.session_id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col relative">
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                <Calendar className="w-16 h-16 text-[#D4AF37]" />
                <div>
                  <h3 className="text-xl font-medium">{t.SCHEDULE_GENERATOR}</h3>
                  <p className="text-sm">Describe what you need a schedule for and the time range.</p>
                </div>
              </div>
            )}
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'user' ? 'bg-[#D4AF37]' : 'bg-white/10'
                  }`}>
                    {msg.role === 'user' ? <UserIcon className="w-5 h-5 text-black" /> : <Bot className="w-5 h-5 text-[#D4AF37]" />}
                  </div>
                  <div className={`p-4 rounded-2xl ${
                    msg.role === 'user' ? 'bg-[#D4AF37] text-black' : 'bg-white/5 text-white'
                  }`}>
                    <div className="prose prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-[#D4AF37] animate-spin" />
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 text-white italic text-sm">
                    {t.BUDDY_THINKING}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/10">
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider opacity-50 flex items-center gap-2">
                    <MessageSquare className="w-3 h-3" /> {t.DESCRIBE}
                  </label>
                  <textarea
                    value={describe}
                    onChange={(e) => setDescribe(e.target.value)}
                    placeholder="e.g., Study plan for final exams"
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors resize-none h-24 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider opacity-50 flex items-center gap-2">
                    <Clock className="w-3 h-3" /> {t.TIME_RANGE}
                  </label>
                  <input
                    type="text"
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    placeholder="e.g., 2 weeks, 5 days, 10 hours"
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors text-sm"
                  />
                </div>
              </div>
              <button
                onClick={handleGenerate}
                disabled={!describe.trim() || !timeRange.trim() || loading}
                className="w-full p-4 bg-[#D4AF37] hover:bg-[#B8962E] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Calendar className="w-5 h-5" />}
                {t.GENERATE_SCHEDULE}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleGenerator;
