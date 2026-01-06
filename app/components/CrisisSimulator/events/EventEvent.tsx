'use client'
import React, { useEffect } from 'react';
import { Bomb, Heart, Repeat, Share, MessageSquare } from 'lucide-react';
import { ExplosionContent, SoundType } from '@/app/data/crisisSteps';

interface ExplosionEventProps {
  content: ExplosionContent;
  playNotificationSound: (type: SoundType | string) => void;
}

const EventEvent: React.FC<ExplosionEventProps> = ({ content, playNotificationSound }) => {

  useEffect(() => {
    playNotificationSound('explosion');

    content.tweets.forEach((_, idx) => {
      const timeout = setTimeout(() => {
        playNotificationSound('tweet');
      }, 1000 + (idx * 1000));
      return () => clearTimeout(timeout);
    });
    
    const waTimeout = setTimeout(() => {
      playNotificationSound('whatsapp');
    }, 3000);

    return () => {
       clearTimeout(waTimeout);
    };
  }, [content, playNotificationSound]);

  return (
    <div className="space-y-6">
      <div className="bg-(--light-red) border-2 border-red-500 rounded-2xl p-6 text-center animate-pulse-fast">
        <h3 className="text-3xl font-bold mb-4 text-(--red-tpm) flex justify-center items-center gap-2">
          <Bomb size={32} /> EXPLOSIÓN
        </h3>
        <p className="text-xl text-(--black-tpm)">{content.explosion}</p>
      </div>

      <div className="bg-[#507fe1]/10 border border-[#507fe1]/50 rounded-xl p-6 animate-fadeIn" style={{animationDelay: '1s', opacity: 0, animationFillMode: 'forwards'}}>
        <h3 className="text-lg font-bold mb-4 text-[#507fe1] border-b border-slate-700 pb-2">
          Tendencias en X
        </h3>
        <div className="space-y-4">
          {content.tweets.map((tweet, idx) => (
            <div key={idx} className="bg-black border border-slate-800 rounded-xl p-4 transition-colors animate-fadeInUp" style={{animationDelay: `${1 + (idx * 1)}s`, opacity: 0, animationFillMode: 'forwards'}}>
              <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white shrink-0">
                    {tweet.user.charAt(0)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-0.5">
                        <span className="font-bold text-white truncate">{tweet.user}</span>
                        <span className="text-slate-500 text-sm truncate">{tweet.handle}</span>
                        <span className="text-slate-500 text-sm">·</span>
                        <span className="text-slate-500 text-sm">{tweet.time || '1m'}</span>
                    </div>
                    
                    <div className="text-white text-[15px] leading-normal mb-3 whitespace-pre-wrap">
                        {tweet.message}
                    </div>

                    <div className="flex justify-between text-slate-500 max-w-md pr-4">
                        <div className="flex items-center gap-2 group cursor-pointer hover:text-blue-500 transition-colors">
                          <MessageSquare size={16} /> <span className="text-xs">12</span>
                        </div>
                        <div className="flex items-center gap-2 group cursor-pointer hover:text-green-500 transition-colors">
                          <Repeat size={16} /> <span className="text-xs">48</span>
                        </div>
                        <div className="flex items-center gap-2 group cursor-pointer hover:text-pink-500 transition-colors">
                          <Heart size={16} /> <span className="text-xs">182</span>
                        </div>
                        <div className="flex items-center gap-2 group cursor-pointer hover:text-blue-500 transition-colors">
                          <Share size={16} />
                        </div>
                    </div>
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-(--light-yellow) border border-amber-500 rounded-lg p-4 animate-fadeIn" style={{animationDelay: '2s', opacity: 0, animationFillMode: 'forwards'}}>
        <h3 className="text-lg font-semibold mb-2 text-amber-500">⚠️ Amenaza Personal</h3>
        <div className="bg-slate-800 p-3 rounded text-slate-100 flex-col">
          
          <p className='text-sm font-light'>
            De: +52 XXXX XXXXXX
          </p>
          <p className="message text-amber-100">

            {`"` + content.threat.message + `"`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventEvent;
