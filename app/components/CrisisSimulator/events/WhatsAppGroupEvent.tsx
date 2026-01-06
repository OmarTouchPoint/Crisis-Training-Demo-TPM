import React, { useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import { Message, SoundType } from '@/app/data/crisisSteps';

interface WhatsAppEventProps {
  messages: Message[];
  playNotificationSound: (type: SoundType | string) => void;
}

const WhatsAppGroupEvent: React.FC<WhatsAppEventProps> = ({ messages, playNotificationSound }) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messages.forEach((_, idx) => {
      const timeout = setTimeout(() => {
        playNotificationSound('whatsapp');
      }, idx * 800);
      return () => clearTimeout(timeout);
    });
  }, [messages, playNotificationSound]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="bg-[#e5f5f5] rounded-2xl p-4 border border-(--turq-tpm) h-full overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4 text-(--turq-tpm) flex items-center gap-2">
        <MessageCircle size={20} /> Chat Grupal TouchPoint
      </h3>
      <div className="space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sent ? 'justify-end' : 'justify-start'} animate-fadeInUp`}
            style={{ animationDelay: `${idx * 0.8}s`, opacity: 0, animationFillMode: 'forwards' }}
          >
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl relative shadow-sm ${
              msg.sent
                ? 'bg-[#dcf8c6] text-slate-800 rounded-br-sm ml-auto'
                : 'bg-white text-slate-800 rounded-bl-sm mr-auto'
            }`}>
              {!msg.sent && <div className="text-xs font-bold text-blue-600 mb-1">{msg.sender}</div>}
              <div className="text-sm leading-snug">{msg.message}</div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
};

export default WhatsAppGroupEvent;
