'use client'
import React from 'react';
import { BreakingNewContent } from '@/app/data/crisisSteps';

interface BreakingNewEventProps {
  content: BreakingNewContent;
}

const BreakingNewEvent: React.FC<BreakingNewEventProps> = ({ content }) => {
  return (
    <div className="bg-black border-4 border-red-700 rounded-xl p-4 animate-fadeIn shadow-2xl shadow-red-500/30">
      <div className="relative">
        <div className="absolute top-2 left-2 bg-red-700 text-white font-bold uppercase tracking-widest px-3 py-1 text-sm rounded flex items-center gap-2 animate-pulse">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          EN VIVO
        </div>
        <video src={content.url} controls autoPlay muted className='w-full rounded-md'></video>
      </div>
      <div className="mt-3 bg-red-700 text-white p-3 rounded-b-lg">
        <h3 className="text-2xl font-bold uppercase">{content.encabezado}</h3>
      </div>
    </div>
  );
};

export default BreakingNewEvent;
