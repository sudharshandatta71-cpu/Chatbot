import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { Chat } from './components/Chat';
import { Header } from './components/Header';
import { CodeGenerator } from './components/CodeGenerator';
import { CodeExplainer } from './components/CodeExplainer';
import DTS from './components/DTS';
import ScheduleGenerator from './components/ScheduleGenerator';
import Dictionary from './components/Dictionary';
import ScientificCalculator from './components/ScientificCalculator';
import EBooks from './components/EBooks';
import ResumeBuilder from './components/ResumeBuilder';
import Programs from './components/Programs';
import JobNotifications from './components/JobNotifications';
import Campus from './components/Campus';
import { User, Theme, AppLanguage, AppFeature } from './types';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('cb_token'));
  const [theme, setTheme] = useState<Theme>((localStorage.getItem('cb_theme') as Theme) || 'dark');
  const [language, setLanguage] = useState<AppLanguage>('ENGLISH');
  const [activeFeature, setActiveFeature] = useState<AppFeature>('CHAT');
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      if (!token) {
        setInitializing(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          localStorage.removeItem('cb_token');
          setToken(null);
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setInitializing(false);
      }
    };

    checkSession();
  }, [token]);

  useEffect(() => {
    localStorage.setItem('cb_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#000000';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#FFFFFF';
    }
  }, [theme]);

  const handleLogin = (newToken: string, newUser: User) => {
    if (!newUser.isGuest) {
      localStorage.setItem('cb_token', newToken);
    }
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('cb_token');
      setToken(null);
      setUser(null);
      setActiveFeature('CHAT');
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  if (initializing) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <AnimatePresence mode="wait">
        {!user ? (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Auth onLogin={handleLogin} />
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-screen"
          >
            <Header 
              user={user} 
              theme={theme} 
              language={language}
              activeFeature={activeFeature}
              onThemeToggle={toggleTheme} 
              onLanguageChange={setLanguage}
              onFeatureChange={setActiveFeature}
              onLogout={handleLogout} 
            />
            <main className="flex-1 overflow-hidden">
              {activeFeature === 'CHAT' && (
                <Chat theme={theme} user={user} language={language} />
              )}
              {activeFeature === 'DTS' && (
                <DTS theme={theme} user={user} language={language} />
              )}
              {activeFeature === 'CODE_GENERATOR' && (
                <CodeGenerator theme={theme} user={user} language={language} />
              )}
              {activeFeature === 'CODE_EXPLAINER' && (
                <CodeExplainer theme={theme} user={user} language={language} />
              )}
              {activeFeature === 'SCHEDULE_GENERATOR' && (
                <ScheduleGenerator theme={theme} user={user} language={language} />
              )}
              {activeFeature === 'DICTIONARY' && (
                <Dictionary theme={theme} user={user} language={language} />
              )}
              {activeFeature === 'SYNTHETIC_CALCI' && (
                <ScientificCalculator theme={theme} language={language} />
              )}
              {activeFeature === 'EBOOKS' && (
                <EBooks theme={theme} language={language} />
              )}
              {activeFeature === 'RESUME_BUILDER' && (
                <ResumeBuilder theme={theme} user={user} language={language} />
              )}
              {activeFeature === 'PROGRAMS' && (
                <Programs theme={theme} language={language} />
              )}
              {activeFeature === 'JOB_NOTIFICATIONS' && (
                <JobNotifications theme={theme} user={user} language={language} />
              )}
              {activeFeature === 'CAMPUS' && (
                <Campus theme={theme} language={language} />
              )}
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
