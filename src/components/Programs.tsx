import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Filter, ChevronDown, Code2 } from 'lucide-react';
import { AppLanguage, Theme } from '../types';
import { TRANSLATIONS } from '../constants';

interface ProgramsProps {
  theme: Theme;
  language: AppLanguage;
}

const LANGUAGES = ['C', 'PYTHON', 'C#', 'C++', 'JAVA', 'JAVA SCRIPT', 'DSA', 'HTML', 'CSS'];

type Difficulty = 'Easy' | 'Medium' | 'Difficult';

interface Question {
  id: string;
  language: string;
  topic: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  sampleInput: string;
  expectedOutput: string;
}

// Hardcoded questions for demonstration
const QUESTIONS: Question[] = [
  { id: '1', language: 'PYTHON', topic: 'Basics', title: 'Hello World', difficulty: 'Easy', description: 'Print "Hello, World!" to the console.', sampleInput: 'None', expectedOutput: 'Hello, World!' },
  { id: '2', language: 'PYTHON', topic: 'Strings', title: 'Reverse String', difficulty: 'Easy', description: 'Reverse a given string.', sampleInput: '"hello"', expectedOutput: '"olleh"' },
  { id: '3', language: 'PYTHON', topic: 'Algorithms', title: 'Two Sum', difficulty: 'Medium', description: 'Find two numbers in an array that add up to a target.', sampleInput: '[2, 7, 11, 15], target = 9', expectedOutput: '[0, 1]' },
  { id: '4', language: 'JAVA', topic: 'Arrays', title: 'Find Max', difficulty: 'Easy', description: 'Find the maximum element in an array.', sampleInput: '[1, 5, 3, 9, 2]', expectedOutput: '9' },
  { id: '5', language: 'JAVA', topic: 'OOP', title: 'Singleton Pattern', difficulty: 'Medium', description: 'Implement a thread-safe Singleton class.', sampleInput: 'None', expectedOutput: 'Singleton Instance' },
  { id: '6', language: 'DSA', topic: 'Trees', title: 'Invert Binary Tree', difficulty: 'Medium', description: 'Invert a binary tree.', sampleInput: '[4,2,7,1,3,6,9]', expectedOutput: '[4,7,2,9,6,3,1]' },
  { id: '7', language: 'DSA', topic: 'Graphs', title: 'Dijkstra Algorithm', difficulty: 'Difficult', description: 'Find the shortest path in a weighted graph.', sampleInput: 'Graph Adjacency Matrix', expectedOutput: 'Shortest Path Array' },
  { id: '8', language: 'C++', topic: 'Pointers', title: 'Swap Numbers', difficulty: 'Easy', description: 'Swap two numbers using pointers.', sampleInput: 'a=5, b=10', expectedOutput: 'a=10, b=5' },
  { id: '9', language: 'JAVA SCRIPT', topic: 'Async', title: 'Promise All', difficulty: 'Medium', description: 'Implement a custom Promise.all function.', sampleInput: '[Promise.resolve(1), Promise.resolve(2)]', expectedOutput: '[1, 2]' },
  { id: '10', language: 'HTML', topic: 'Forms', title: 'Login Form', difficulty: 'Easy', description: 'Create a semantic HTML login form.', sampleInput: 'None', expectedOutput: '<form>...</form>' },
  { id: '11', language: 'CSS', topic: 'Flexbox', title: 'Center a Div', difficulty: 'Easy', description: 'Center a div horizontally and vertically using Flexbox.', sampleInput: 'None', expectedOutput: 'display: flex; justify-content: center; align-items: center;' },
  { id: '12', language: 'C', topic: 'Memory', title: 'Dynamic Array', difficulty: 'Medium', description: 'Allocate and resize an array dynamically using malloc and realloc.', sampleInput: 'Size 5, then resize to 10', expectedOutput: 'Array of size 10' },
  { id: '13', language: 'C#', topic: 'LINQ', title: 'Filter Even Numbers', difficulty: 'Easy', description: 'Use LINQ to filter even numbers from a list.', sampleInput: '[1, 2, 3, 4, 5]', expectedOutput: '[2, 4]' },
];

const Programs: React.FC<ProgramsProps> = ({ theme, language }) => {
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | 'All'>('All');
  const [sortBy, setSortBy] = useState<'DifficultyAsc' | 'DifficultyDesc' | 'None'>('None');

  const t = TRANSLATIONS[language] || TRANSLATIONS['ENGLISH'];

  const filteredQuestions = QUESTIONS.filter(q => {
    if (selectedLang && q.language !== selectedLang) return false;
    if (filterDifficulty !== 'All' && q.difficulty !== filterDifficulty) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'None') return 0;
    const diffMap = { 'Easy': 1, 'Medium': 2, 'Difficult': 3 };
    if (sortBy === 'DifficultyAsc') return diffMap[a.difficulty] - diffMap[b.difficulty];
    return diffMap[b.difficulty] - diffMap[a.difficulty];
  });

  return (
    <div className={`flex flex-col h-[calc(100vh-80px)] ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Terminal className="w-6 h-6 text-[#D4AF37]" />
          <h2 className="text-xl font-bold tracking-tight">{t.PROGRAMS}</h2>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        {/* Languages Sidebar */}
        <div className="w-full md:w-64 border-r border-white/10 overflow-y-auto p-4 bg-black/5">
          <h3 className="text-sm font-semibold uppercase tracking-wider opacity-50 mb-4">Languages</h3>
          <div className="space-y-2">
            {LANGUAGES.map(lang => (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 ${
                  selectedLang === lang 
                    ? 'bg-[#D4AF37] text-black font-bold' 
                    : 'hover:bg-white/10'
                }`}
              >
                <Code2 className="w-4 h-4" />
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Questions Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedLang ? (
            <>
              {/* Filters */}
              <div className="p-4 border-b border-white/10 flex flex-wrap gap-4 items-center bg-black/5">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 opacity-50" />
                  <span className="text-sm font-medium">Filter:</span>
                  <select 
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value as any)}
                    className="bg-transparent border border-white/20 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="All">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Difficult">Difficult</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Sort:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent border border-white/20 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="None">Default</option>
                    <option value="DifficultyAsc">Difficulty (Easy to Hard)</option>
                    <option value="DifficultyDesc">Difficulty (Hard to Easy)</option>
                  </select>
                </div>
              </div>

              {/* Questions List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                  {filteredQuestions.length === 0 ? (
                    <div className="text-center opacity-50 py-10">
                      No questions found for the selected criteria.
                    </div>
                  ) : (
                    filteredQuestions.map(q => (
                      <motion.div
                        key={q.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="border border-white/10 rounded-xl p-4 bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">{q.topic}</span>
                            <h3 className="text-lg font-bold mt-1">{q.title}</h3>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            q.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                            q.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {q.difficulty}
                          </span>
                        </div>
                        <p className="text-sm opacity-80 mb-4">{q.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-black/50 p-3 rounded-lg border border-white/5">
                            <span className="text-xs font-bold opacity-50 uppercase block mb-1">Sample Input</span>
                            <code className="text-sm font-mono text-[#D4AF37]">{q.sampleInput}</code>
                          </div>
                          <div className="bg-black/50 p-3 rounded-lg border border-white/5">
                            <span className="text-xs font-bold opacity-50 uppercase block mb-1">Expected Output</span>
                            <code className="text-sm font-mono text-green-400">{q.expectedOutput}</code>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-50">
              <Terminal className="w-16 h-16 text-[#D4AF37] mb-4" />
              <p>Select a programming language to view questions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Programs;
