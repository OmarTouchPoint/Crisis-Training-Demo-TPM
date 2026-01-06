/* eslint-disable react/no-unescaped-entities */
'use client'
import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

import { routes, DecisionState, GameState, Route } from '@/app/data/crisisSteps';
import { useSound } from '@/app/hooks/useSound';
import { useTimer } from '@/app/hooks/useTimer';

import IntroView from './views/IntroView';
import PlayingView from './views/PlayingView';
import DecisionView from './views/DecisionView';
import ResultsView from './views/ResultsView';

const CrisisSimulation: React.FC = () => {
  // --- ESTADOS ---
  const [gameState, setGameState] = useState<GameState>('intro');
  const [currentRouteId, setCurrentRouteId] = useState<string>('initial');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [crisisName] = useState<string>('Crisis Touchpoint');
  const [decisions, setDecisions] = useState<DecisionState>({
    immediateAction: '',
    teamComm: '',
    clientAction: '',
    additionalNotes: ''
  });

  // --- HOOKS ---
  const { initAudio, playNotificationSound } = useSound(soundEnabled);
  const { timeRemaining, formatTime, resetTimer } = useTimer(gameState, 600, submitDecisions);

  // --- LÓGICA DE RUTAS ---
  const currentRoute: Route | undefined = routes.find(r => r.id === currentRouteId);
  const currentSteps = currentRoute ? currentRoute.steps : [];

  // --- MANEJADORES ---
  const startSimulation = () => {
    initAudio(); 
    setGameState('playing');
    setCurrentRouteId('initial');
    setCurrentStep(0);
    setIsStarted(true);
    resetTimer();
  };

  const nextStep = () => {
    if (currentSteps[currentStep]?.type === 'transition') {
      // No avanzar automáticamente en un paso de transición
      return;
    }
    if (currentStep < currentSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Fin de la ruta, pasar a la pantalla de decisiones
      setGameState('decision');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleOptionSelect = (optionId: string) => {
    const nextRoute = routes.find(r => r.id === optionId);
    if (nextRoute) {
      setCurrentRouteId(optionId);
      setCurrentStep(0);
    } else {
      console.error(`Route with id "${optionId}" not found!`);
    }
  };

  const handleDecisionChange = (field: keyof DecisionState, value: string) => {
    setDecisions(prev => ({ ...prev, [field]: value }));
  };

  function submitDecisions() {
    setGameState('results');
  }

  const restartSimulation = () => {
    setIsStarted(false);
    setGameState('intro');
    setDecisions({
      immediateAction: '',
      teamComm: '',
      clientAction: '',
      additionalNotes: ''
    });
    setCurrentRouteId('initial');
    setCurrentStep(0);
    resetTimer();
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  // --- RENDERIZADO DE VISTAS ---
  const renderGameState = () => {
    if (!currentRoute) {
      return <div>Error: Ruta no encontrada.</div>;
    }

    switch (gameState) {
      case 'intro':
        return <IntroView onStartSimulation={startSimulation} />;
      case 'playing':
        return (
          <PlayingView
            crisisName={crisisName}
            currentStep={currentStep}
            totalSteps={currentSteps.length}
            stepData={currentSteps[currentStep]}
            playNotificationSound={playNotificationSound}
            onPrevStep={prevStep}
            onNextStep={nextStep}
            onOptionSelect={handleOptionSelect}
          />
        );
      case 'decision':
        return (
          <DecisionView
            timeRemaining={timeRemaining}
            formattedTime={formatTime(timeRemaining)}
            decisions={decisions}
            onDecisionChange={handleDecisionChange}
            onSubmit={submitDecisions}
          />
        );
      case 'results':
        return (
          <ResultsView
            decisions={decisions}
            timeRemaining={timeRemaining}
            formattedTime={formatTime(timeRemaining)}
            onRestart={restartSimulation}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${ isStarted ? "step-bg" : "main-bg" }`}>
      
      {/* Definición de animaciones custom */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes zoomIn {
           from { opacity: 0; transform: scale(0.95); }
           to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.5s ease-out forwards; }
        .animate-fadeIn { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-slideInLeft { animation: slideInLeft 0.5s ease-out forwards; }
        .animate-slideInRight { animation: slideInRight 0.5s ease-out forwards; }
        .animate-zoomIn { animation: zoomIn 0.5s ease-out forwards; }
        .animate-pulse-fast { animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>

      {/* Control de Sonido Global */}
      <button 
        onClick={toggleSound}
        className="fixed top-4 right-4 z-50 p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors border border-slate-600"
        title={soundEnabled ? "Silenciar" : "Activar Sonido"}
      >
        {soundEnabled ? <Volume2 size={20} className="text-green-400"/> : <VolumeX size={20} className="text-red-400"/>}
      </button>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {renderGameState()}
      </div>
    </div>
  );
};

export default CrisisSimulation;