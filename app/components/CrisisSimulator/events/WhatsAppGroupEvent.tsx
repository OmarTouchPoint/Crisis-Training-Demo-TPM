'use client';
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import { Message, SoundType } from '@/app/data/crisisSteps';

interface WhatsAppEventProps {
  messages: Message[];
  playNotificationSound: (type: SoundType | string) => void;
  onSequenceComplete?: () => void;
}

const MESSAGE_STAGGER_MS = 800;
const ANIMATION_DURATION_MS = 500; // The duration of the 'fadeInUp' animation

const WhatsAppGroupEvent: React.FC<WhatsAppEventProps> = ({ messages, playNotificationSound, onSequenceComplete }) => {
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This effect controls the sequential appearance of messages
    const timeouts: NodeJS.Timeout[] = [];

    messages.forEach((msg, idx) => {
      const timeout = setTimeout(() => {
        playNotificationSound('whatsapp');
        setVisibleMessages(prev => {
            const newMessages = (idx === 0) ? [msg] : [...prev, msg];
            return newMessages;
        });
      }, idx * MESSAGE_STAGGER_MS);
      timeouts.push(timeout);
    });

    // Calculate total duration for all message animations to signal completion
    const totalDuration = (messages.length - 1) * MESSAGE_STAGGER_MS + ANIMATION_DURATION_MS;
    const completionTimeout = setTimeout(() => {
      onSequenceComplete?.();
    }, totalDuration);
    timeouts.push(completionTimeout);

    // Cleanup function to clear all timeouts
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [messages, playNotificationSound, onSequenceComplete]);

  useEffect(() => {
    // This effect handles scrolling to the end of the chat
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [visibleMessages]); // Trigger scroll as new messages become visible

  return (
    <div className="bg-[#e5f5f5] rounded-2xl p-4 border border-slate-300 h-full overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4 text-slate-700 flex items-center gap-2">
        <MessageCircle size={20} /> Chat Grupal TouchPoint
      </h3>
      <div className="space-y-4">
        {visibleMessages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sent ? 'justify-end' : 'justify-start'} animate-fadeInUp`}
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
