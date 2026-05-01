import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, Loader2, Trash2, History, Plus, MessageSquare, Search, Paperclip, X, FileText, Image as ImageIcon } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { CODE_EXPLAIN_INSTRUCTION, PROGRAMMING_LANGUAGES, TRANSLATIONS } from '../constants';
import { Message, ChatSession, User as UserType, AppLanguage } from '../types';
import { extractTextFromFile } from '../utils/fileProcessor';

interface CodeExplainerProps {
  theme: 'light' | 'dark';
  user: UserType;
  language: AppLanguage;
}

interface AttachedFile {
  name: string;
  type: string;
  data: string; // base64
  text?: string; // extracted text for docs
}

export const CodeExplainer: React.FC<CodeExplainerProps> = ({ theme, user, language }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>(Date.now().toString());
  const [showHistory, setShowHistory] = useState(false);
  const [selectedLang, setSelectedLang] = useState(PROGRAMMING_LANGUAGES[0]);
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[language] || TRANSLATIONS['ENGLISH'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!user.isGuest) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/chat/history?type=code_explain', {
        headers: { Authorization: `Bearer ${localStorage.getItem('cb_token')}` },
      });
      const data = await response.json();
      setHistory(data.sessions || []);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
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
      if (window.innerWidth < 768) setShowHistory(false);
    } catch (error) {
      console.error('Failed to load session:', error);
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentSessionId(Date.now().toString());
    if (window.innerWidth < 768) setShowHistory(false);
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
        body: JSON.stringify({ sessionId: currentSessionId, role, text, type: 'code_explain' }),
      });
      fetchHistory();
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

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !attachedFile) || loading) return;

    const displayInput = attachedFile 
      ? `[${selectedLang}] Code to explain:\n${input}\n\n[Attached File: ${attachedFile.name}]`
      : `[${selectedLang}] Code to explain:\n${input}`;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: displayInput,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const codeToAnalyze = input;
    const currentFile = attachedFile;
    setInput('');
    setAttachedFile(null);
    setLoading(true);

    await saveMessage('user', userMessage.text);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const parts: any[] = [];

      let promptText = `Language: ${selectedLang}\nCode: ${codeToAnalyze}\nPreferred Explanation Language: ${language}`;
      
      if (currentFile) {
        if (currentFile.type.startsWith('image/') || currentFile.type === 'application/pdf') {
          parts.push({
            inlineData: {
              data: currentFile.data,
              mimeType: currentFile.type
            }
          });
          promptText = `Language: ${selectedLang}\nUser has uploaded a file: ${currentFile.name}. Please analyze it and explain the code within it. Additional context/code: ${codeToAnalyze || 'Explain the code in this file.'}\nPreferred Explanation Language: ${language}`;
        } else if (currentFile.text) {
          promptText = `Language: ${selectedLang}\nUser has uploaded a document: ${currentFile.name}.\nContent:\n${currentFile.text}\n\nCode to explain: ${codeToAnalyze || 'Explain the code in this document.'}\nPreferred Explanation Language: ${language}`;
        }
      }

      parts.push({ text: promptText });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          { role: 'user', parts }
        ],
        config: {
          systemInstruction: CODE_EXPLAIN_INSTRUCTION,
        },
      });

      const aiText = response.text || 'Error explaining code.';
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: aiText,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      await saveMessage('model', aiText);
    } catch (error) {
      console.error('AI Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'Failed to analyze code. Please try again.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (!window.confirm('Delete this chat?')) return;
    try {
      await fetch(`/api/chat/history/${sessionId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('cb_token')}` },
      });
      if (currentSessionId === sessionId) startNewChat();
      fetchHistory();
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  return (
    <div className="flex h-full relative overflow-hidden">
      {!user.isGuest && (
        <motion.aside
          initial={false}
          animate={{ width: showHistory ? 300 : 0, opacity: showHistory ? 1 : 0 }}
          className={`h-full border-r overflow-hidden flex flex-col ${
            theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
          }`}
        >
          <div className="p-4 flex flex-col h-full">
            <button
              onClick={startNewChat}
              className="w-full gold-gradient text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 mb-6 hover:scale-[1.02] transition-transform shadow-lg"
            >
              <Plus className="w-5 h-5" />
              {t.NEW_CHAT}
            </button>

            <div className="flex-1 overflow-y-auto space-y-2">
              <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>
                {t.CHAT_HISTORY}
              </h3>
              {history.length === 0 ? (
                <p className="text-zinc-500 text-sm italic text-center py-4">No history yet</p>
              ) : (
                history.map((session) => (
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
                    <Search className="w-4 h-4 shrink-0" />
                    <span className="text-sm truncate flex-1">{session.first_msg}</span>
                    <button
                      onClick={(e) => deleteSession(e, session.session_id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.aside>
      )}

      <div className="flex-1 flex flex-col h-full relative">
        <div className="p-4 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            {!user.isGuest && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`p-2 rounded-xl border transition-all ${
                  theme === 'dark' 
                    ? 'bg-zinc-900 border-zinc-800 text-gold hover:border-gold' 
                    : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400'
                }`}
              >
                <History className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center gap-3">
              <span className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>
                {t.SELECT_LANGUAGE}
              </span>
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className={`px-4 py-2 rounded-lg border text-sm font-bold focus:outline-none transition-all ${
                  theme === 'dark'
                    ? 'bg-zinc-900 border-zinc-800 text-gold focus:border-gold'
                    : 'bg-white border-zinc-200 text-black focus:border-gold'
                }`}
              >
                {PROGRAMMING_LANGUAGES.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            <div className={`flex-1 overflow-y-auto mb-4 rounded-2xl p-4 border ${
              theme === 'dark' ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-zinc-200'
            } gold-shadow`}>
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-20 h-20 gold-gradient rounded-full flex items-center justify-center mb-4 gold-shadow">
                    <Search className="w-10 h-10 text-black" />
                  </div>
                  <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                    {t.CODE_EXPLAINER}
                  </h3>
                  <p className="text-zinc-500 max-w-md">
                    Paste your code below and select the language. I will provide a detailed step-by-step explanation.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <AnimatePresence>
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex gap-3 max-w-[95%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            msg.role === 'user' ? 'bg-gold text-black' : 'bg-zinc-800 text-gold'
                          }`}>
                            {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                          </div>
                          <div className={`rounded-2xl px-4 py-3 ${
                            msg.role === 'user'
                              ? 'bg-gold text-black font-medium rounded-tr-none'
                              : theme === 'dark'
                                ? 'bg-zinc-800 text-zinc-100 rounded-tl-none border border-zinc-700'
                                : 'bg-zinc-100 text-zinc-900 rounded-tl-none border border-zinc-200'
                          }`}>
                            {msg.role === 'user' ? (
                              <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed overflow-x-auto">
                                {msg.text}
                              </pre>
                            ) : (
                              <div className="prose prose-invert prose-sm max-w-none">
                                <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                      <div className="flex gap-3 items-center text-zinc-500">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                          <Bot className="w-5 h-5 text-gold" />
                        </div>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm italic">{t.BUDDY_THINKING}</span>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 mb-4">
              <AnimatePresence>
                {attachedFile && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`flex items-center gap-3 p-2 rounded-xl border ${
                      theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center text-gold">
                      {attachedFile.type.startsWith('image/') ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                    </div>
                    <span className="text-xs font-bold truncate flex-1">{attachedFile.name}</span>
                    <button
                      onClick={() => setAttachedFile(null)}
                      className="p-1 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleAnalyze} className="flex flex-col gap-4">
                <div className="relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t.ENTER_CODE}
                    rows={4}
                    className={`w-full py-4 px-6 rounded-2xl border focus:outline-none transition-all resize-none font-mono text-sm ${
                      theme === 'dark'
                        ? 'bg-zinc-900 border-zinc-800 text-white focus:border-gold'
                        : 'bg-white border-zinc-200 text-black focus:border-gold'
                    } gold-shadow-hover`}
                  />
                  <div className="absolute right-3 top-3 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all text-xs font-bold border ${
                        theme === 'dark' 
                          ? 'bg-zinc-800 border-zinc-700 text-gold hover:bg-zinc-700' 
                          : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:bg-zinc-200'
                      }`}
                      title={t.UPLOAD}
                    >
                      <Paperclip className="w-4 h-4" />
                      <span className="hidden sm:inline">{t.UPLOAD}</span>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,image/*"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={(!input.trim() && !attachedFile) || loading}
                  className="w-full gold-gradient text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : (
                    <>
                      <Search className="w-5 h-5" />
                      {t.ANALYZE_CODE}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
