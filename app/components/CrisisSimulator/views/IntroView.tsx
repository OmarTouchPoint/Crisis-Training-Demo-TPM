'use client'
import React from 'react';

interface IntroViewProps {
  onStartSimulation: () => void;
}

const IntroView: React.FC<IntroViewProps> = ({ onStartSimulation }) => {
  return (
    <div className="animate-zoomIn">
      <div className="text-center mb-12 pt-10">
        <h1 className="text-5xl font-bold mb-6 ">
          🚨 CRISIS TOUCHPOINT
        </h1>
        <p className="text-2xl  font-light tracking-wide">Simulación Interactiva de Manejo de Crisis</p>
      </div>
      
      <div className=" rounded-3xl p-10 border bg-white text-(--black-tpm) ">
        <video poster='/placeholder-video.png' src="/introduction-video.mp4" controls className='w-full rounded-2xl mb-10 text'></video>
        
        <div className="space-y-8 mb-10">
          <p className=" leading-relaxed text-xl  text-left  mx-auto">
            Estás a punto de experimentar una simulación realista. 
            Como parte del equipo, enfrentarás eventos inesperados que pondrán 
            a prueba tus habilidades de toma de decisiones bajo presión.
          </p>
          
          <div className="grid md:flex-col gap-6">
            <div className="bg-(--light-yellow) border border-yellow-600/50 rounded-xl p-6 text-lg">
              <h3 className="font-bold  mb-3 flex items-center gap-2">📋 Instrucciones</h3>
              <ul className="font-light space-y-2">
                <li className="flex gap-2 items-start"><span className="opacity-50">•</span> Observa cada situación cuidadosamente</li>
                <li className="flex gap-2 items-start"><span className="opacity-50">•</span> Toma notas mentales de los eventos</li>
                <li className="flex gap-2 items-start"><span className="opacity-50">•</span> Al final tendrás 10 minutos para decidir</li>
              </ul>
            </div>
            
            <div className="bg-(--red-light) border border-red-600/50 rounded-xl p-6">
              <h3 className="font-bold  mb-3 flex items-center gap-2">⚠️ Contexto Inicial</h3>
              <p className="text-lg font-light ">
                Jueves 11 de septiembre, 8:30 AM. Entregas de Finnosummit y webinar de Business Republic programados. Algo no está bien...
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <button 
            onClick={onStartSimulation}
            className=" bg-(--red-tpm) text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-red-500/20 ring-4 ring-transparent hover:ring-red-500/30"
          >
          Iniciar Simulación
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntroView;
