'use client'
import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { InstructionsContent } from '@/app/data/crisisSteps';

const DEFAULT_STEP_DURATION = 1200;

interface InstructionsEventProps {
  content: InstructionsContent;
  onSequenceComplete?: () => void;
}

const InstructionsEvent: React.FC<InstructionsEventProps> = ({ content, onSequenceComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onSequenceComplete?.();
    }, DEFAULT_STEP_DURATION);
    return () => clearTimeout(timer);
  }, [onSequenceComplete]);

  return (
    <div className="bg-red-100 border border-red-500 rounded-2xl p-8 animate-zoomIn">
      <h3 className="text-3xl font-bold mb-8 text-center text-red-600">{content.title}</h3>
      <div className="space-y-4 mb-8">
        {content.instructions.map((ins, idx) => (
          <div key={idx} className="bg-red-600 rounded-lg p-4 border-l-4 border-red-800 flex items-start gap-3">
            <div className="mt-1 text-white"><ArrowRight size={16}/></div>
            <p className="text-white font-medium text-lg">{ins}</p>
          </div>
        ))}
      </div>
      <div className=" rounded-lg p-4 text-center animate-pulse">
        <p className='font-bold text-red-600 text-xl uppercase tracking-wider'>{content.priority}</p>
        <p className="font-bold text-slate-600 text-xl tracking-wider">{content.urgency}</p>
      </div>
    </div>
  );
}
export default InstructionsEvent;
