'use client'
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { InstructionsContent } from '@/app/data/crisisSteps';

interface InstructionsEventProps {
  content: InstructionsContent;
}

const InstructionsEvent: React.FC<InstructionsEventProps> = ({ content }) => (
  <div className="bg-(--red-light) border border-(--red-tpm) rounded-2xl p-8 animate-zoomIn">
     <h3 className="text-3xl font-bold mb-8 text-center text-(--red-tpm)">{content.title}</h3>
     <div className="space-y-4 mb-8">
        {content.instructions.map((ins, idx) => (
           <div key={idx} className="bg-(--red-tpm) rounded-lg p-4 border-l-4 border-(--red-tpm) flex items-start gap-3">
              <div className="mt-1 text-white"><ArrowRight size={16}/></div>
              <p className="text-white font-medium text-lg">{ins}</p>
           </div>
        ))}
     </div>
     <div className=" rounded-lg p-4 text-center animate-pulse">
        <p className='font-bold text-(--red-tpm) text-xl uppercase tracking-wider'>{content.priority}</p>
        <p className="font-bold text-(--gray-tpm) text-xl tracking-wider">{content.urgency}</p>
     </div>
  </div>
);

export default InstructionsEvent;
