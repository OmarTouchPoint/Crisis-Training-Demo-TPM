'use client'
import React, { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { AlertContent, SoundType } from '@/app/data/crisisSteps';

const DEFAULT_STEP_DURATION = 1200;

interface AlertEventProps {
  content: AlertContent;
  onSequenceComplete?: () => void;
  playNotificationSound: (type: SoundType | string) => void;
}

const AlertEvent: React.FC<AlertEventProps> = ({ content, onSequenceComplete, playNotificationSound }) => {
  useEffect(() => {
    const soundTimeout = setTimeout(() => {
      playNotificationSound('alert');
    }, 200); // Play sound shortly after appearance

    const sequenceTimeout = setTimeout(() => {
      onSequenceComplete?.();
    }, DEFAULT_STEP_DURATION);
    return () => {
      clearTimeout(soundTimeout);
      clearTimeout(sequenceTimeout);
    };
  }, [onSequenceComplete, playNotificationSound]);

  return (
    <div className="bg-red-100 border border-red-600 rounded-lg p-4 animate-slideInLeft max-w-2xl mx-auto shadow-lg">
      <h3 className="text-lg font-semibold mb-2 text-red-700 flex items-center gap-2">
        <AlertTriangle size={20} /> {content.title}
      </h3>
      <p className="text-slate-800 font-normal mb-3">{content.context}</p>
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span className="font-bold">Urgencia: <span className="text-red-500">{content.urgency}</span></span>
        <span className="font-bold">Prioridad: <span className="text-red-500">{content.priority}</span></span>
      </div>
    </div>
  );
};

export default AlertEvent;
