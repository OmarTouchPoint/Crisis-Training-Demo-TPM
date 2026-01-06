'use client'
import React, { useEffect, useRef } from 'react';
import { Message, WhatsAppChatContent } from '@/app/data/crisisSteps';
import { ArrowLeft, Phone, Video, Mic, Paperclip, Camera, Smile } from 'lucide-react';

interface WhatsAppChatEventProps {
  content: WhatsAppChatContent;
}

const WhatsAppChatEvent: React.FC<WhatsAppChatEventProps> = ({ content }) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [content.messages]);

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl border-8 border-black overflow-hidden animate-fadeInUp">
      <div className="bg-[#075E54] text-white p-2 flex items-center gap-3">
        <ArrowLeft size={24} />
        <img src={content.chatPerfilImg} alt="Profile" className="w-10 h-10 rounded-full bg-gray-300" />
        <div className="flex-1">
          <h2 className="font-semibold text-lg">{content.chatPerfilName}</h2>
          <p className="text-xs opacity-80">en línea</p>
        </div>
        <Video size={24} className="mx-2" />
        <Phone size={24} />
      </div>

      <div className="bg-[#ECE5DD] p-4 h-96 overflow-y-auto" style={{ backgroundImage: 'url("/whatsapp-bg.png")', backgroundSize: 'contain' }}>
        <div className="space-y-2 flex flex-col">
          {content.messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] px-3 py-2 rounded-lg relative shadow-md ${
                msg.sent 
                  ? 'bg-[#DCF8C6] text-slate-800' 
                  : 'bg-white text-slate-800'
              }`}>
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
