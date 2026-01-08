import React, { useEffect } from 'react';
import { MessageSquare, Repeat, Heart, Share } from 'lucide-react';
import { Tweet, SoundType } from '../../../data/crisisSteps';

const DEFAULT_STEP_DURATION = 1200;

interface TwitterPostEventProps {
  content: Tweet;
  playNotificationSound: (type: SoundType | string) => void;
  onSequenceComplete?: () => void;
}

const TwitterPostEvent: React.FC<TwitterPostEventProps> = ({ content, playNotificationSound, onSequenceComplete }) => {
  useEffect(() => {
    const soundTimeout = setTimeout(() => {
      playNotificationSound('tweet');
    }, 500);

    const sequenceTimeout = setTimeout(() => {
      onSequenceComplete?.();
    }, DEFAULT_STEP_DURATION);

    return () => {
      clearTimeout(soundTimeout);
      clearTimeout(sequenceTimeout);
    };
  }, [playNotificationSound, onSequenceComplete]);

  return (
    
    <div  className="bg-black border border-slate-800 rounded-xl p-4 transition-colors animate-fadeInUp" >
      <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white shrink-0">
            {content.user.charAt(0)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-0.5">
                <span className="font-bold text-white truncate">{content.user}</span>
                <span className="text-slate-500 text-sm truncate">{content.handle}</span>
                <span className="text-slate-500 text-sm">·</span>
                <span className="text-slate-500 text-sm">{content.time || '1m'}</span>
            </div>
            
            <div className="text-white text-[15px] leading-normal mb-3 whitespace-pre-wrap">
                {content.message}
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
  );
};

export default TwitterPostEvent;
