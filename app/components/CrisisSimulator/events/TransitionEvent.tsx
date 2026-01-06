'use client'
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { TransitionContent, TransitionOption } from '@/app/data/crisisSteps';

interface TransitionEventProps {
  content: TransitionContent;
  onOptionSelect: (optionId: string) => void;
}

const TransitionEvent: React.FC<TransitionEventProps> = ({ content, onOptionSelect }) => (
  <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-8 animate-zoomIn text-white">
     <h3 className="text-2xl font-bold mb-6 text-center text-amber-400">{content.title}</h3>
     <div className="space-y-4">
        {content.options.map((opt) => (
           <button 
              key={opt.id} 
              onClick={() => onOptionSelect(opt.id)}
              className="w-full bg-slate-700 hover:bg-slate-600 rounded-lg p-4 border-l-4 border-amber-500 flex items-center justify-between gap-3 transition-colors duration-200 text-left"
            >
              <p className="text-white font-medium text-lg flex-1">{opt.option}</p>
              <ArrowRight size={20} className="text-amber-400"/>
           </button>
        ))}
     </div>
  </div>
);

export default TransitionEvent;
