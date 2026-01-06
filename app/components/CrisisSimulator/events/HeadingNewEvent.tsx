'use client'
import React from 'react';
import { HeadingNewContent } from '@/app/data/crisisSteps';

const HeadingNewEvent: React.FC<{ content: HeadingNewContent }> = ({ content }) => {
  return (
    <div className="bg-[#F1EFEA] border-2 border-black p-6 font-serif animate-fadeInUp max-w-2xl mx-auto shadow-lg">
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
