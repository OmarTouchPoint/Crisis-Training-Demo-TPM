'use client'
import React, { useEffect } from 'react';
import { HeadingNewContent, SoundType } from '@/app/data/crisisSteps';

const DEFAULT_STEP_DURATION = 1200;

interface HeadingNewEventProps {
  content: HeadingNewContent;
  playNotificationSound: (type: SoundType | string) => void;
  onSequenceComplete?: () => void;
}

const HeadingNewEvent: React.FC<HeadingNewEventProps> = ({ content, playNotificationSound, onSequenceComplete }) => {
  useEffect(() => {
    const soundTimeout = setTimeout(() => {
      // Using 'tweet' as a generic "new item" sound
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
    <div className="bg-[#F1EFEA] border-2 border-black p-6 font-serif max-w-2xl mx-auto shadow-lg">
      {/* Masthead */}
      <header className="text-center border-b-4 border-black pb-4 mb-4">
        <h1 className="text-6xl text-black font-black tracking-tighter">EL UNIVERSAL</h1>
        <p className="text-sm uppercase tracking-widest">El Gran Diario de México</p>
      </header>

      <div className="border-b border-gray-400 pb-2 mb-4">
        <p className="text-xs text-black text-right">{content.date}</p>
      </div>

      {/* Main Content */}
      <main>
        {/* Headline */}
        <h2 className="text-4xl font-bold leading-tight mb-4 text-justify text-black">
          {content.heading}
        </h2>

        {/* Image */}
        <div className="my-4">
          <img src={content.placeholderImg} alt="Artículo de periódico" className="w-full filter grayscale" />
          <p className="text-xs italic text-black mt-1">Las oficinas de la agencia en la colonia Condesa permanecen acordonadas por seguridad privada.</p>
        </div>

        {/* Article */}
        <div className="text-justify text-md leading-relaxed text-black" style={{ columns: 2, columnGap: '20px' }}>
          <p>{content.article}</p>
        </div>
      </main>
    </div>
  );
};

export default HeadingNewEvent;
