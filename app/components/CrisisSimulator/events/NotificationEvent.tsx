'use client'
import React from 'react';
import { MessageCircle, Smartphone } from 'lucide-react';
import { NotificationContent } from '@/app/data/crisisSteps';

interface NotificationEventProps {
  content: NotificationContent;
}

const NotificationEvent: React.FC<NotificationEventProps> = ({ content }) => {
  const IconComponent = content.icon === 'whatsapp' ? MessageCircle : Smartphone;

  return (
    <div className="bg-slate-800/80 rounded-lg p-3 animate-fadeInUp flex items-start gap-3 max-w-md mx-auto shadow-lg">
      <div className={`mt-1 p-2 rounded-full ${content.icon === 'whatsapp' ? 'bg-green-600/20 text-green-500' : 'bg-blue-600/20 text-blue-500'}`}>
        <IconComponent size={16} />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-slate-300">De: {content.senderContact}</span>
            <span className="text-xs text-slate-400 font-mono">{content.time}</span>
        </div>
        <div className="text-orange-200 italic text-sm">"{content.message}"</div>
        <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest text-right">{content.icon}</div>
      </div>
    </div>
  );
};

export default NotificationEvent;
