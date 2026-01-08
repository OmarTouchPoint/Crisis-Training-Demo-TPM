'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Message, SoundType } from '@/app/data/crisisSteps';
import { ArrowLeft, Phone, Video, Mic, Paperclip, Camera, Smile } from 'lucide-react';

const MESSAGE_STAGGER_MS = 800;
const ANIMATION_DURATION_MS = 500;

interface WhatsAppChatEventProps {
  messages: Message[];
  chatPerfilImg: string;
  chatPerfilName: string;
  playNotificationSound: (type: SoundType | string) => void;
  onSequenceComplete?: () => void;
}

const WhatsAppChatEvent: React.FC<WhatsAppChatEventProps> = ({ messages, chatPerfilImg, chatPerfilName, playNotificationSound, onSequenceComplete }) => {
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleMessages([]);
    const timeouts: NodeJS.Timeout[] = [];

    messages.forEach((msg, idx) => {
      const timeout = setTimeout(() => {
        playNotificationSound('whatsapp');
        setVisibleMessages(prev => [...prev, msg]);
      }, idx * MESSAGE_STAGGER_MS);
      timeouts.push(timeout);
    });

    const totalDuration = (messages.length - 1) * MESSAGE_STAGGER_MS + ANIMATION_DURATION_MS;
    const completionTimeout = setTimeout(() => {
      onSequenceComplete?.();
    }, totalDuration);
    timeouts.push(completionTimeout);

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [messages, playNotificationSound, onSequenceComplete]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [visibleMessages]);

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl border-8 border-black overflow-hidden">
      <div className="bg-[#075E54] text-white p-2 flex items-center gap-3">
        <ArrowLeft size={24} />
        <img src={chatPerfilImg} alt="Profile" className="w-10 h-10 rounded-full bg-gray-300" />
        <div className="flex-1">
          <h2 className="font-semibold text-lg">{chatPerfilName}</h2>
          <p className="text-xs opacity-80">en línea</p>
        </div>
        <Video size={24} className="mx-2" />
        <Phone size={24} />
      </div>

      <div className="bg-[#ECE5DD] p-4 h-96 overflow-y-auto" style={{ backgroundImage: 'url("/whatsapp-bg.png")', backgroundSize: 'contain' }}>
        <div className="space-y-2 flex flex-col">
          {visibleMessages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.sent ? 'justify-end' : 'justify-start'} animate-fadeInUp`}
            >
              <div className={`max-w-[80%] px-3 py-2 rounded-lg relative shadow-md ${
                msg.sent 
                  ? 'bg-[#DCF8C6] text-slate-800' 
                  : 'bg-white text-slate-800'
              }`}>
                {!msg.sent && <div className="text-xs font-bold text-teal-600 mb-1">{msg.sender}</div>}
                <div className="text-sm">{msg.message}</div>
                <div className={`text-[10px] text-right mt-1 ${msg.sent ? 'text-green-700' : 'text-gray-500'}`}>
                  10:56 AM
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>

      <div className="bg-gray-100 p-2 flex items-center gap-2">
        <Smile size={28} className="text-gray-500" />
        <div className="flex-1 bg-white rounded-full flex items-center px-4 py-2">
          <input type="text" placeholder="Mensaje" className="bg-transparent w-full outline-none" />
          <Paperclip size={24} className="text-gray-500 mx-2" />
          <Camera size={24} className="text-gray-500" />
        </div>
        <div className="bg-[#128C7E] text-white p-3 rounded-full">
          <Mic size={24} />
        </div>
      </div>
    </div>
  );
};

export default WhatsAppChatEvent;
