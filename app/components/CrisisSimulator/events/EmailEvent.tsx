'use client'
import React, { useEffect } from 'react';
import { Mail } from 'lucide-react';
import { EmailContent, SoundType } from '@/app/data/crisisSteps';

interface EmailEventProps {
  content: EmailContent;
  playNotificationSound: (type: SoundType | string) => void;
}

const EmailEvent: React.FC<EmailEventProps> = ({ content, playNotificationSound }) => {

  useEffect(() => {
    const timeout = setTimeout(() => {
      playNotificationSound('email');
    }, 500);
    return () => clearTimeout(timeout);
  }, [playNotificationSound]);

  return (
    <div className="bg-slate-100 rounded-lg border border-slate-300 p-6 animate-fadeIn text-slate-800 shadow-lg max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold mb-4 text-blue-600 flex items-center gap-2 border-b pb-2 border-slate-300">
        <Mail size={20} /> Correo Electrónico
      </h3>
      <div className="space-y-2 mb-4 font-mono text-sm">
        <div><span className="font-bold text-slate-600">De:</span> {content.from}</div>
        <div><span className="font-bold text-slate-600">Para:</span> {content.to}</div>
        <div><span className="font-bold text-slate-600">Asunto:</span> {content.subject}</div>
      </div>
      <div className="bg-white p-4 rounded border-l-4 border-red-500 shadow-inner">
        <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700">{content.body}</pre>
      </div>
    </div>
  );
};

export default EmailEvent;
