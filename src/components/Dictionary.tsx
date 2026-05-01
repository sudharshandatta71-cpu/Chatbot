import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Loader2, Trash2, History, Plus, MessageSquare, Search, Book, Send, User as UserIcon } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { DICTIONARY_INSTRUCTION, TRANSLATIONS } from '../constants';
import { Message, ChatSession, User as UserType, AppLanguage } from '../types';

interface DictionaryProps {
  theme: 'light' | 'dark';
  user: UserType;
  language: AppLanguage;
}

const Dictionary: React.FC<DictionaryProps> = ({ theme, user, language }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [word, setWord] = useState('');
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
      const response = await fetch(`/api/chat/sessions?userId=${user.id}&type=DICTIONARY`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const startNewSession = () => {
    setCurrentSessionId(null);
    setMessages([]);
    setWord('');
  };

  const loadSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/chat/messages?sessionId=${sessionId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
        setCurrentSessionId(sessionId);
        setShowHistory(false);
      }
    } catch (error) {
      console.error('Error loading session:', error);
    }
  };

  const clearHistory = async () => {
    if (!currentSessionId) return;
    try {
      const response = await fetch(`/api/chat/clear?sessionId=${currentSessionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        startNewSession();
        fetchSessions();
      }
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!word.trim() || loading) return;

    setLoading(true);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: `Word: ${word}`,
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
              { text: DICTIONARY_INSTRUCTION },
              { text: `Preferred Language: ${language}` },
              { text: `Word to define: ${word}` },
              { text: "Please provide a comprehensive definition and all related dictionary information." }
            ]
          }
        ]
      });

      const response = await model;
      const aiResponse = response.text || "Sorry, I couldn't find information for this word.";

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: aiResponse,
        timestamp: Date.now()
      };

      const finalMessages = [...newMessages, botMessage];
      setMessages(finalMessages);

      if (user.id !== -1) {
        const sessionResponse = await fetch('/api/chat/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            userId: user.id,
            sessionId: currentSessionId,
            messages: finalMessages,
            type: 'DICTIONARY'
          })
        });

        if (sessionResponse.ok) {
          const { sessionId } = await sessionResponse.json();
          setCurrentSessionId(sessionId);
          fetchSessions();
        }
      }
    } catch (error) {
      console.error('Dictionary search error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "An error occurred while searching for the word.",
        timestamp: Date.now()
      }]);
    } finally {
      setLoading(false);
      setWord('');
    }
  };

  return (
    <div className={`flex flex-col h-[calc(100vh-80px)] ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Book className="w-6 h-6 text-[#D4AF37]" />
          <h2 className="text-xl font-bold tracking-tight">{t.DICTIONARY}</h2>
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
              onClick={clearHistory}
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
                    <button
                      key={session.id}
                      onClick={() => loadSession(session.id)}
                      className="w-full text-left p-3 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-3 group"
                    >
                      <MessageSquare className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                      <span className="truncate text-sm">{session.title}</span>
                    </button>
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
                <Book className="w-16 h-16 text-[#D4AF37]" />
                <div>
                  <h3 className="text-xl font-medium">{t.DICTIONARY}</h3>
                  <p className="text-sm">Enter a word to get its definition and more.</p>
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
            <form onSubmit={handleSearch} className="max-w-4xl mx-auto flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50" />
                <input
                  type="text"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  placeholder={t.SEARCH_WORD}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={!word.trim() || loading}
                className="px-8 bg-[#D4AF37] hover:bg-[#B8962E] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                {t.SEARCH}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dictionary;
