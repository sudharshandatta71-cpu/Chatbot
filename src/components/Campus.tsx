import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, Calendar, Bus, Coffee, FileText, ExternalLink, ChevronRight, ArrowLeft } from 'lucide-react';
import { AppLanguage, Theme } from '../types';
import { TRANSLATIONS } from '../constants';

interface CampusProps {
  theme: Theme;
  language: AppLanguage;
}

type CampusSection = 'HOME' | 'EVENTS' | 'BUS_ROUTES' | 'CANTEEN' | 'ADMISSION';

const EVENTS = [
  { name: 'SYNERGY', description: '(a cultural event)' },
  { name: 'FEST', description: '(ANNUAL DAY)' },
  { name: 'INNOQUEST', description: '(HACKATHON)' },
  { name: 'TECH HACK', description: '(HACKATHON)' },
  { name: 'DATA DYNAMO', description: '(TECHNICAL AND NON-TECHNICAL ACTIVITIES)' },
];

const BUS_ROUTES = Array.from({ length: 70 }, (_, i) => ({
  no: i + 1,
  route: `Bus No. ${i + 1} kondapur to AU and AU to kondapur`,
  time: 'expected time is 1hr 30mins'
}));

const Campus: React.FC<CampusProps> = ({ theme, language }) => {
  const [activeSection, setActiveSection] = useState<CampusSection>('HOME');
  const t = TRANSLATIONS[language] || TRANSLATIONS['ENGLISH'];

  const renderHome = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center justify-center h-full space-y-8"
    >
      <div className="text-center">
        <GraduationCap className="w-24 h-24 text-[#D4AF37] mx-auto mb-4" />
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
          ANURAG <span className="text-[#D4AF37]">UNIVERSITY</span>
        </h1>
        <p className="text-xl opacity-70 mt-2 font-medium tracking-widest uppercase">Explore Campus Life</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl px-4">
        {[
          { id: 'EVENTS', icon: Calendar, label: 'EVENTS', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
          { id: 'BUS_ROUTES', icon: Bus, label: 'BUS ROUTES', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
          { id: 'CANTEEN', icon: Coffee, label: 'CANTEEN TIMINGS', color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
          { id: 'ADMISSION', icon: FileText, label: 'ADMISSION', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id as CampusSection)}
            className={`flex items-center justify-between p-6 rounded-2xl border transition-all hover:scale-105 ${item.color}`}
          >
            <div className="flex items-center gap-4">
              <item.icon className="w-8 h-8" />
              <span className="text-xl font-bold tracking-wider">{item.label}</span>
            </div>
            <ChevronRight className="w-6 h-6 opacity-50" />
          </button>
        ))}
      </div>
    </motion.div>
  );

  const renderSectionHeader = (title: string, icon: any) => {
    const Icon = icon;
    return (
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => setActiveSection('HOME')}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <Icon className="w-8 h-8 text-[#D4AF37]" />
        <h2 className="text-3xl font-black tracking-tighter uppercase">{title}</h2>
      </div>
    );
  };

  const renderEvents = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl mx-auto w-full p-4"
    >
      {renderSectionHeader('EVENTS', Calendar)}
      <div className="grid gap-4">
        {EVENTS.map((event, idx) => (
          <div key={idx} className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
            <h3 className="text-2xl font-bold text-[#D4AF37] tracking-wider">{event.name}</h3>
            <p className="text-lg opacity-70 mt-2 font-medium">{event.description}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderBusRoutes = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl mx-auto w-full p-4 h-full flex flex-col"
    >
      {renderSectionHeader('BUS ROUTES', Bus)}
      <div className="flex-1 overflow-y-auto pr-4 space-y-3">
        {BUS_ROUTES.map((bus) => (
          <div key={bus.no} className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
              <span className="text-[#D4AF37] font-black text-lg">{bus.no}</span>
            </div>
            <div>
              <p className="font-bold text-lg">{bus.route}</p>
              <p className="text-sm opacity-60 font-mono mt-1">{bus.time}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderCanteen = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl mx-auto w-full p-4"
    >
      {renderSectionHeader('CANTEEN TIMINGS', Coffee)}
      <div className="p-8 rounded-3xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-center space-y-6">
        <Coffee className="w-20 h-20 text-[#D4AF37] mx-auto" />
        <h3 className="text-3xl font-black tracking-widest text-[#D4AF37]">9AM to 3PM</h3>
        <p className="text-xl font-bold opacity-80 uppercase tracking-wider">Monday to Saturday</p>
        <div className="inline-block px-6 py-3 rounded-full bg-white/10 border border-white/20">
          <p className="text-lg font-medium">All type of food available</p>
        </div>
      </div>
    </motion.div>
  );

  const renderAdmission = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl mx-auto w-full p-4"
    >
      {renderSectionHeader('ADMISSION', FileText)}
      <div className="space-y-6">
        <div className="p-8 rounded-3xl border border-white/10 bg-white/5">
          <h3 className="text-2xl font-bold text-[#D4AF37] mb-4">Welcome to Anurag University Admissions</h3>
          <p className="text-lg leading-relaxed opacity-80 mb-6">
            Anurag University offers a wide range of undergraduate, postgraduate, and doctoral programs across various disciplines including Engineering, Pharmacy, Management, and Sciences. Our admission process is designed to identify and nurture talent, ensuring that every student has the opportunity to excel in their chosen field.
          </p>
          <p className="text-lg leading-relaxed opacity-80 mb-6">
            We provide state-of-the-art infrastructure, experienced faculty, and strong industry connections to help you build a successful career. Join us to experience a vibrant campus life, innovative learning methodologies, and comprehensive placement support.
          </p>
          <a
            href="https://anurag.edu.in/admissions/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#D4AF37] text-black font-black rounded-xl hover:bg-[#B8962E] transition-colors uppercase tracking-wider"
          >
            Visit Official Website <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className={`flex flex-col h-[calc(100vh-80px)] ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="flex-1 overflow-hidden flex">
        <AnimatePresence mode="wait">
          {activeSection === 'HOME' && <div key="home" className="w-full h-full">{renderHome()}</div>}
          {activeSection === 'EVENTS' && <div key="events" className="w-full h-full overflow-y-auto">{renderEvents()}</div>}
          {activeSection === 'BUS_ROUTES' && <div key="bus" className="w-full h-full overflow-hidden">{renderBusRoutes()}</div>}
          {activeSection === 'CANTEEN' && <div key="canteen" className="w-full h-full overflow-y-auto">{renderCanteen()}</div>}
          {activeSection === 'ADMISSION' && <div key="admission" className="w-full h-full overflow-y-auto">{renderAdmission()}</div>}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Campus;
