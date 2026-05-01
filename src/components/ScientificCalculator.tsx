import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, RotateCcw, Delete, Equal } from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { AppLanguage } from '../types';

interface ScientificCalculatorProps {
  theme: 'light' | 'dark';
  language: AppLanguage;
}

const ScientificCalculator: React.FC<ScientificCalculatorProps> = ({ theme, language }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isNewCalculation, setIsNewCalculation] = useState(true);

  const t = TRANSLATIONS[language] || TRANSLATIONS['ENGLISH'];

  const handleNumber = (num: string) => {
    if (isNewCalculation) {
      setDisplay(num);
      setIsNewCalculation(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setIsNewCalculation(true);
  };

  const handleFunction = (func: string) => {
    try {
      let result: number;
      const val = parseFloat(display);
      
      switch (func) {
        case 'sin': result = Math.sin(val); break;
        case 'cos': result = Math.cos(val); break;
        case 'tan': result = Math.tan(val); break;
        case 'sqrt': result = Math.sqrt(val); break;
        case 'log': result = Math.log10(val); break;
        case 'ln': result = Math.log(val); break;
        case 'pow2': result = Math.pow(val, 2); break;
        case 'pow3': result = Math.pow(val, 3); break;
        case 'exp': result = Math.exp(val); break;
        case 'abs': result = Math.abs(val); break;
        case 'pi': result = Math.PI; break;
        case 'e': result = Math.E; break;
        default: return;
      }
      
      setDisplay(result.toString());
      setIsNewCalculation(true);
    } catch (error) {
      setDisplay('Error');
    }
  };

  const calculate = () => {
    try {
      const fullEquation = equation + display;
      // Using a safer alternative to eval for basic math
      // For a real app, use a math library like mathjs
      const result = Function('"use strict";return (' + fullEquation.replace(/×/g, '*').replace(/÷/g, '/') + ')')();
      setDisplay(result.toString());
      setEquation('');
      setIsNewCalculation(true);
    } catch (error) {
      setDisplay('Error');
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
    setIsNewCalculation(true);
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const buttons = [
    { label: 'sin', type: 'func' }, { label: 'cos', type: 'func' }, { label: 'tan', type: 'func' }, { label: 'sqrt', type: 'func' }, { label: 'AC', type: 'clear', icon: RotateCcw },
    { label: 'log', type: 'func' }, { label: 'ln', type: 'func' }, { label: 'x²', type: 'func', value: 'pow2' }, { label: 'x³', type: 'func', value: 'pow3' }, { label: '⌫', type: 'back', icon: Delete },
    { label: 'π', type: 'func', value: 'pi' }, { label: 'e', type: 'func', value: 'e' }, { label: '|x|', type: 'func', value: 'abs' }, { label: 'exp', type: 'func' }, { label: '÷', type: 'op' },
    { label: '7', type: 'num' }, { label: '8', type: 'num' }, { label: '9', type: 'num' }, { label: '(', type: 'num' }, { label: '×', type: 'op' },
    { label: '4', type: 'num' }, { label: '5', type: 'num' }, { label: '6', type: 'num' }, { label: ')', type: 'num' }, { label: '-', type: 'op' },
    { label: '1', type: 'num' }, { label: '2', type: 'num' }, { label: '3', type: 'num' }, { label: '.', type: 'num' }, { label: '+', type: 'op' },
    { label: '0', type: 'num', colSpan: 2 }, { label: '=', type: 'equal', icon: Equal, colSpan: 2 }
  ];

  return (
    <div className={`flex flex-col h-[calc(100vh-80px)] items-center justify-center p-4 ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-6 opacity-50">
          <Calculator className="w-5 h-5" />
          <span className="text-sm font-semibold uppercase tracking-wider">{t.SYNTHETIC_CALCI}</span>
        </div>

        {/* Display */}
        <div className="bg-black/40 rounded-2xl p-6 mb-6 text-right overflow-hidden border border-white/5">
          <div className="text-xs opacity-50 h-4 mb-1 font-mono truncate">{equation}</div>
          <div className="text-4xl font-bold font-mono truncate tracking-tight">{display}</div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-5 gap-2">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (btn.type === 'num') handleNumber(btn.label);
                else if (btn.type === 'op') handleOperator(btn.label);
                else if (btn.type === 'func') handleFunction(btn.value || btn.label);
                else if (btn.type === 'clear') clear();
                else if (btn.type === 'back') backspace();
                else if (btn.type === 'equal') calculate();
              }}
              className={`
                p-4 rounded-xl text-sm font-bold transition-all active:scale-95 flex items-center justify-center
                ${btn.colSpan === 2 ? 'col-span-2' : ''}
                ${btn.type === 'num' ? 'bg-white/10 hover:bg-white/20' : ''}
                ${btn.type === 'op' ? 'bg-white/5 hover:bg-white/10 text-[#D4AF37]' : ''}
                ${btn.type === 'func' ? 'bg-white/5 hover:bg-white/10 text-indigo-400' : ''}
                ${btn.type === 'clear' ? 'bg-red-500/20 hover:bg-red-500/30 text-red-500' : ''}
                ${btn.type === 'back' ? 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-500' : ''}
                ${btn.type === 'equal' ? 'bg-[#D4AF37] hover:bg-[#B8962E] text-black' : ''}
              `}
            >
              {btn.icon ? <btn.icon className="w-5 h-5" /> : btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScientificCalculator;
