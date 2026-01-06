'use client'
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { AlertContent } from '@/app/data/crisisSteps';

interface AlertEventProps {
  content: AlertContent;
}

const AlertEvent: React.FC<AlertEventProps> = ({ content }) => {
  return (
    <div className="bg-(--red-light) border border-red-600 rounded-lg p-4 animate-slideInLeft max-w-2xl mx-auto shadow-lg">
      <h3 className="text-lg font-semibold mb-2 text-(--red-tpm) flex items-center gap-2">
        <AlertTriangle size={20} /> {content.title}
      </h3>
      <p className="text-(--black-tpm) font-normal mb-3">{content.context}</p>
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span className="font-bold">Urgencia: <span className="text-red-500">{content.urgency}</span></span>
        <span className="font-bold">Prioridad: <span className="text-red-500">{content.priority}</span></span>
      </div>
    </div>
  );
};

export default AlertEvent;
