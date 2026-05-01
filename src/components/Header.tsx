import React from 'react';
import { motion } from 'motion/react';
import { LogOut, User, Sun, Moon, Globe, MessageSquare, Code, Search, FileText, Calendar, Book, Calculator, Library, Briefcase, Terminal, Bell, GraduationCap } from 'lucide-react';
import { User as UserType, Theme, AppLanguage, AppFeature } from '../types';
import { PREFERRED_LANGUAGES, TRANSLATIONS } from '../constants';

interface HeaderProps {
  user: UserType;
  theme: Theme;
  language: AppLanguage;
  activeFeature: AppFeature;
  onThemeToggle: () => void;
  onLanguageChange: (lang: AppLanguage) => void;
  onFeatureChange: (feature: AppFeature) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  user, theme, language, activeFeature, 
  onThemeToggle, onLanguageChange, onFeatureChange, onLogout 
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS['ENGLISH'];

  return (
    <header className={`w-full border-b ${
      theme === 'dark' ? 'bg-black border-zinc-800' : 'bg-white border-zinc-200'
    } sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center gold-shadow">
              <span className="text-black font-black text-xl">CB</span>
            </div>
            <h1 className={`text-2xl font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              CAMPUS <span className="text-gold">BUDDY</span>
            </h1>
          </div>

          <nav className="flex items-center gap-1 bg-zinc-900/50 p-1 rounded-xl border border-zinc-800 overflow-x-auto max-w-full md:max-w-[60vw] no-scrollbar">
            <button
              onClick={() => onFeatureChange('CHAT')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeFeature === 'CHAT' ? 'bg-gold text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">{t.CHAT}</span>
            </button>
            <button
              onClick={() => onFeatureChange('DTS')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeFeature === 'DTS' ? 'bg-gold text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">{t.DTS}</span>
            </button>
            <button
              onClick={() => onFeatureChange('CODE_GENERATOR')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeFeature === 'CODE_GENERATOR' ? 'bg-gold text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Code className="w-4 h-4" />
              <span className="hidden sm:inline">{t.CODE_GENERATOR}</span>
            </button>
            <button
              onClick={() => onFeatureChange('CODE_EXPLAINER')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeFeature === 'CODE_EXPLAINER' ? 'bg-gold text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">{t.CODE_EXPLAINER}</span>
            </button>
            <button
              onClick={() => onFeatureChange('SCHEDULE_GENERATOR')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeFeature === 'SCHEDULE_GENERATOR' ? 'bg-gold text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">{t.SCHEDULE_GENERATOR}</span>
            </button>
            <button
              onClick={() => onFeatureChange('DICTIONARY')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeFeature === 'DICTIONARY' ? 'bg-gold text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Book className="w-4 h-4" />
              <span className="hidden sm:inline">{t.DICTIONARY}</span>
            </button>
            <button
              onClick={() => onFeatureChange('SYNTHETIC_CALCI')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeFeature === 'SYNTHETIC_CALCI' ? 'bg-gold text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">{t.SYNTHETIC_CALCI}</span>
            </button>
            <button
              onClick={() => onFeatureChange('EBOOKS')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeFeature === 'EBOOKS' ? 'bg-gold text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Library className="w-4 h-4" />
              <span className="hidden sm:inline">{t.EBOOKS}</span>
            </button>
            <button
              onClick={() => onFeatureChange('RESUME_BUILDER')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeFeature === 'RESUME_BUILDER' ? 'bg-gold text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline">{t.RESUME_BUILDER}</span>
            </button>
            <button
              onClick={() => onFeatureChange('PROGRAMS')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeFeature === 'PROGRAMS' ? 'bg-gold text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span className="hidden sm:inline">{t.PROGRAMS}</span>
            </button>
            <button
              onClick={() => onFeatureChange('JOB_NOTIFICATIONS')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeFeature === 'JOB_NOTIFICATIONS' ? 'bg-gold text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">{t.JOB_NOTIFICATIONS}</span>
            </button>
            <button
              onClick={() => onFeatureChange('CAMPUS')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeFeature === 'CAMPUS' ? 'bg-gold text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline">{t.CAMPUS}</span>
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4 flex-wrap justify-center">
          {/* Language Selector */}
          <div className="relative group">
            <button className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
              theme === 'dark' 
                ? 'bg-zinc-900 border-zinc-800 text-gold hover:border-gold' 
                : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:border-zinc-400'
            }`}>
              <Globe className="w-4 h-4" />
              <span className="text-xs font-bold">{language}</span>
            </button>
            <div className={`absolute right-0 mt-2 w-40 rounded-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform group-hover:translate-y-0 translate-y-2 py-2 gold-shadow z-[60] ${
              theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
            }`}>
              {PREFERRED_LANGUAGES.map(lang => (
                <button
                  key={lang}
                  onClick={() => onLanguageChange(lang as AppLanguage)}
                  className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-gold/10 transition-colors ${
                    language === lang ? 'text-gold' : theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onThemeToggle}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
              theme === 'dark' 
                ? 'bg-zinc-900 border-zinc-800 text-gold hover:border-gold' 
                : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:border-zinc-400'
            }`}
          >
            {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            <span className="text-xs font-bold">{theme === 'dark' ? 'DARK' : 'BRIGHT'}</span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative group">
            <button className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-all ${
              theme === 'dark'
                ? 'bg-zinc-900 border-zinc-800 text-white hover:border-gold'
                : 'bg-zinc-100 border-zinc-200 text-black hover:border-zinc-400'
            }`}>
              <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center text-black font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-bold hidden sm:inline">{user.name}</span>
            </button>

            <div className={`absolute right-0 mt-2 w-48 rounded-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform group-hover:translate-y-0 translate-y-2 py-2 gold-shadow z-[60] ${
              theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
            }`}>
              <div className="px-4 py-2 border-b border-zinc-800 mb-2">
                <p className={`text-xs font-bold uppercase ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>Account Identity</p>
                <p className={`text-sm font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{user.name}</p>
                <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
              </div>
              
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-500/10 transition-colors text-sm font-bold"
              >
                <LogOut className="w-4 h-4" />
                {t.LOGOUT}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="lg:hidden flex items-center gap-2 overflow-x-auto p-2 border-t border-zinc-800 bg-zinc-900/30 no-scrollbar">
        <button
          onClick={() => onFeatureChange('CHAT')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all shrink-0 ${
            activeFeature === 'CHAT' ? 'text-gold' : 'text-zinc-500'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] font-bold">{t.CHAT}</span>
        </button>
        <button
          onClick={() => onFeatureChange('DTS')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all shrink-0 ${
            activeFeature === 'DTS' ? 'text-gold' : 'text-zinc-500'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] font-bold">{t.DTS}</span>
        </button>
        <button
          onClick={() => onFeatureChange('CODE_GENERATOR')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all shrink-0 ${
            activeFeature === 'CODE_GENERATOR' ? 'text-gold' : 'text-zinc-500'
          }`}
        >
          <Code className="w-5 h-5" />
          <span className="text-[10px] font-bold">{t.CODE_GENERATOR}</span>
        </button>
        <button
          onClick={() => onFeatureChange('CODE_EXPLAINER')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all shrink-0 ${
            activeFeature === 'CODE_EXPLAINER' ? 'text-gold' : 'text-zinc-500'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-bold">{t.CODE_EXPLAINER}</span>
        </button>
        <button
          onClick={() => onFeatureChange('SCHEDULE_GENERATOR')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all shrink-0 ${
            activeFeature === 'SCHEDULE_GENERATOR' ? 'text-gold' : 'text-zinc-500'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-bold">{t.SCHEDULE_GENERATOR}</span>
        </button>
        <button
          onClick={() => onFeatureChange('DICTIONARY')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all shrink-0 ${
            activeFeature === 'DICTIONARY' ? 'text-gold' : 'text-zinc-500'
          }`}
        >
          <Book className="w-5 h-5" />
          <span className="text-[10px] font-bold">{t.DICTIONARY}</span>
        </button>
        <button
          onClick={() => onFeatureChange('SYNTHETIC_CALCI')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all shrink-0 ${
            activeFeature === 'SYNTHETIC_CALCI' ? 'text-gold' : 'text-zinc-500'
          }`}
        >
          <Calculator className="w-5 h-5" />
          <span className="text-[10px] font-bold">{t.SYNTHETIC_CALCI}</span>
        </button>
        <button
          onClick={() => onFeatureChange('EBOOKS')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all shrink-0 ${
            activeFeature === 'EBOOKS' ? 'text-gold' : 'text-zinc-500'
          }`}
        >
          <Library className="w-5 h-5" />
          <span className="text-[10px] font-bold">{t.EBOOKS}</span>
        </button>
        <button
          onClick={() => onFeatureChange('RESUME_BUILDER')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all shrink-0 ${
            activeFeature === 'RESUME_BUILDER' ? 'text-gold' : 'text-zinc-500'
          }`}
        >
          <Briefcase className="w-5 h-5" />
          <span className="text-[10px] font-bold">{t.RESUME_BUILDER}</span>
        </button>
        <button
          onClick={() => onFeatureChange('PROGRAMS')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all shrink-0 ${
            activeFeature === 'PROGRAMS' ? 'text-gold' : 'text-zinc-500'
          }`}
        >
          <Terminal className="w-5 h-5" />
          <span className="text-[10px] font-bold">{t.PROGRAMS}</span>
        </button>
        <button
          onClick={() => onFeatureChange('JOB_NOTIFICATIONS')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all shrink-0 ${
            activeFeature === 'JOB_NOTIFICATIONS' ? 'text-gold' : 'text-zinc-500'
          }`}
        >
          <Bell className="w-5 h-5" />
          <span className="text-[10px] font-bold">{t.JOB_NOTIFICATIONS}</span>
        </button>
        <button
          onClick={() => onFeatureChange('CAMPUS')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all shrink-0 ${
            activeFeature === 'CAMPUS' ? 'text-gold' : 'text-zinc-500'
          }`}
        >
          <GraduationCap className="w-5 h-5" />
          <span className="text-[10px] font-bold">{t.CAMPUS}</span>
        </button>
      </nav>
    </header>
  );
};
