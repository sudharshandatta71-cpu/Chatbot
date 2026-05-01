import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Loader2, Trash2, History, Plus, MessageSquare, Paperclip, X, FileText, Image as ImageIcon, Send, User as UserIcon } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { DTS_INSTRUCTION, TRANSLATIONS } from '../constants';
import { Message, ChatSession, User as UserType, AppLanguage } from '../types';
import { extractTextFromFile } from '../utils/fileProcessor';

interface DTSProps {
  theme: 'light' | 'dark';
  user: UserType;
  language: AppLanguage;
}

const DTS: React.FC<DTSProps> = ({ theme, user, language }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; type: string; data: string; text?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
      const response = await fetch('/api/chat/history?type=DTS', {
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
    setAttachedFile(null);
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
    if (!window.confirm('Delete this summary?')) return;
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
        body: JSON.stringify({ sessionId: currentSessionId || Date.now().toString(), role, text, type: 'DTS' }),
      });
      fetchSessions();
    } catch (error) {
      console.error('Failed to save message:', error);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert(t.FILE_SIZE_ERROR);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = (event.target?.result as string).split(',')[1];
      
      try {
        const extractedText = await extractTextFromFile(file);

        setAttachedFile({
          name: file.name,
          type: file.type,
          data: base64,
          text: extractedText
        });
      } catch (err) {
        console.error('File processing error:', err);
        alert(t.FILE_ERROR);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSummarize = async () => {
    if (!attachedFile || loading) return;

    setLoading(true);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: `Summarize this file: ${attachedFile.name}`,
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
              { text: DTS_INSTRUCTION },
              { text: `Preferred Language: ${language}` },
              ...(attachedFile.type.startsWith('image/') || attachedFile.type === 'application/pdf'
                ? [{ inlineData: { mimeType: attachedFile.type, data: attachedFile.data } }]
                : []),
              ...(attachedFile.text ? [{ text: `Document Content:\n${attachedFile.text}` }] : []),
              { text: "Please provide a comprehensive summary with highlights and key points." }
            ]
          }
        ]
      });

      const response = await model;
      const aiResponse = response.text || "Sorry, I couldn't summarize this document.";

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
      console.error('Summarization error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "An error occurred while summarizing the document.",
        timestamp: Date.now()
      }]);
    } finally {
      setLoading(false);
      setAttachedFile(null);
    }
  };

  return (
    <div className={`flex flex-col h-[calc(100vh-80px)] ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-[#D4AF37]" />
          <h2 className="text-xl font-bold tracking-tight">{t.DTS}</h2>
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
                <Bot className="w-16 h-16 text-[#D4AF37]" />
                <div>
                  <h3 className="text-xl font-medium">{t.DTS}</h3>
                  <p className="text-sm">Upload a document or image to get a summary.</p>
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
              {attachedFile && (
                <div className="flex items-center gap-3 p-2 bg-white/5 rounded-xl border border-white/10">
                  {attachedFile.type.startsWith('image/') ? (
                    <ImageIcon className="w-5 h-5 text-[#D4AF37]" />
                  ) : (
                    <FileText className="w-5 h-5 text-[#D4AF37]" />
                  )}
                  <span className="text-sm truncate flex-1">{attachedFile.name}</span>
                  <button
                    onClick={() => setAttachedFile(null)}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,image/*"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all group"
                  title={t.UPLOAD}
                >
                  <Paperclip className="w-6 h-6 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                </button>
                <button
                  onClick={handleSummarize}
                  disabled={!attachedFile || loading}
                  className="flex-1 p-4 bg-[#D4AF37] hover:bg-[#B8962E] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  {t.DTS}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DTS;
