'use client'
import React, { useState, useEffect } from 'react';
import { Bomb, Heart, Repeat, Share, MessageSquare } from 'lucide-react';
import { ExplosionContent, SoundType, Tweet, Threat } from '@/app/data/crisisSteps';

const ANIMATION_STAGGER_MS = 1200;

// --- Sub-components for better structure ---

const ExplosionItem: React.FC<{ text: string }> = ({ text }) => (
  <div className="bg-red-500/10 border-2 border-red-500 rounded-2xl p-6 text-center">
    <h3 className="text-3xl font-bold mb-4 text-red-500 flex justify-center items-center gap-2">
      <Bomb size={32} /> EXPLOSIÓN
    </h3>
    <p className="text-xl  text-(--black-tpm)">{text}</p>
  </div>
);

const TweetItem: React.FC<{ tweet: Tweet }> = ({ tweet }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 transition-colors">
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
          <div className="flex items-center gap-2 group cursor-pointer hover:text-blue-500 transition-colors"><MessageSquare size={16} /> <span className="text-xs">12</span></div>
          <div className="flex items-center gap-2 group cursor-pointer hover:text-green-500 transition-colors"><Repeat size={16} /> <span className="text-xs">48</span></div>
          <div className="flex items-center gap-2 group cursor-pointer hover:text-pink-500 transition-colors"><Heart size={16} /> <span className="text-xs">182</span></div>
          <div className="flex items-center gap-2 group cursor-pointer hover:text-blue-500 transition-colors"><Share size={16} /></div>
        </div>
      </div>
    </div>
  </div>
);

// Exported for use in the parent component
export const ThreatNotification: React.FC<{ threat: Threat }> = ({ threat }) => (
    <div className="bg-slate-800/80 rounded-lg p-3 animate-slideInRight flex items-start gap-3 max-w-md mx-auto shadow-lg border border-amber-500/50">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-amber-400">⚠️ Amenaza Personal</span>
            <span className="text-xs text-slate-400 font-mono">De: {threat.number}</span>
        </div>
        <div className="text-orange-200 italic text-sm">"{threat.message}"</div>
      </div>
    </div>
);


// --- Main Event Component ---

interface EventEventProps {
  content: ExplosionContent;
  playNotificationSound: (type: SoundType | string) => void;
  onSequenceComplete?: () => void;
}

type RenderableItem = 
  | { type: 'explosion'; data: string }
  | { type: 'tweet'; data: Tweet };

const EventEvent: React.FC<EventEventProps> = ({ content, playNotificationSound, onSequenceComplete }) => {
  const [visibleItems, setVisibleItems] = useState<RenderableItem[]>([]);

  useEffect(() => {
    // Sound effects are still played from here
    playNotificationSound('explosion');
    content.tweets.forEach((_, idx) => {
      setTimeout(() => playNotificationSound('tweet'), 1000 + (idx * ANIMATION_STAGGER_MS));
    });
    if (content.threat) {
        setTimeout(() => playNotificationSound('sms'), 1000 + (content.tweets.length * ANIMATION_STAGGER_MS));
    }

    const mainContentSequence: RenderableItem[] = [
      { type: 'explosion', data: content.explosion },
      ...content.tweets.map(t => ({ type: 'tweet', data: t } as RenderableItem)),
    ];
    
    setVisibleItems([]);
    const timeouts: NodeJS.Timeout[] = [];
    
    mainContentSequence.forEach((item, index) => {
      const timeout = setTimeout(() => {
        setVisibleItems(prev => [...prev, item]);
      }, index * ANIMATION_STAGGER_MS);
      timeouts.push(timeout);
    });

    // Signal completion after the last item has had time to appear
    const totalDuration = mainContentSequence.length * ANIMATION_STAGGER_MS;
    const completionTimeout = setTimeout(() => {
      onSequenceComplete?.();
    }, totalDuration);
    timeouts.push(completionTimeout);

    return () => {
      timeouts.forEach(clearTimeout);
    };

  }, [content, playNotificationSound, onSequenceComplete]);
  
  const explosionItem = visibleItems.find(item => item.type === 'explosion') as Extract<RenderableItem, {type: 'explosion'}> | undefined;
  const tweetItems = visibleItems.filter(item => item.type === 'tweet') as Extract<RenderableItem, {type: 'tweet'}>[];

  return (
    <div className="space-y-6">
      {explosionItem && <ExplosionItem text={explosionItem.data} />}
      
      {tweetItems.length > 0 && (
        <div className="bg-[#507fe1]/10 border border-[#507fe1]/50 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4 text-[#507fe1] border-b border-slate-700 pb-2">
            Tendencias en X
          </h3>
          <div className="space-y-4">
            {tweetItems.map((item, index) => (
              <TweetItem key={`tweet-${index}`} tweet={item.data} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventEvent;
