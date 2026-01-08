/* eslint-disable react/no-unescaped-entities */
'use client'
import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

import { routes, DecisionState, GameState, Route, CrisisStep, MixedStep, EventStep } from '@/app/data/crisisSteps';
import { useSound } from '@/app/hooks/useSound';
import { useTimer } from '@/app/hooks/useTimer';

import IntroView from './views/IntroView';
import PlayingView from './views/PlayingView';
import DecisionView from './views/DecisionView';
import ResultsView from './views/ResultsView';
import NotificationEvent from './events/NotificationEvent';
import { ThreatNotification } from './events/EventEvent'; // Assuming ThreatNotification is exported

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
  const stepData = currentSteps[currentStep];

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
    if (stepData?.type === 'transition') {
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

  // --- LÓGICA DE NOTIFICACIONES GLOBALES ---
  const [visibleNotifications, setVisibleNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (gameState !== 'playing' || !stepData) {
      setVisibleNotifications([]);
      return;
    }

    let notificationsToShow: any[] = [];
    if (stepData.type === 'mixed') {
      notificationsToShow = (stepData as MixedStep).content.steps
        .filter(subStep => subStep.type === 'whatsappNotification' || subStep.type === 'smsNotification')
        .map(subStep => ({ type: subStep.type, content: subStep.content }));
    } else if (stepData.type === 'event') {
      if ((stepData as EventStep).content.threat) {
        notificationsToShow.push({ type: 'threat', content: (stepData as EventStep).content.threat });
      }
    }

    setVisibleNotifications([]);
    const timeouts: NodeJS.Timeout[] = [];
    
    notificationsToShow.forEach((notification, index) => {
        const timeout = setTimeout(() => {
            const soundType = notification.type === 'threat' ? 'alert' : (notification.type === 'whatsappNotification' ? 'whatsapp' : 'sms');
            playNotificationSound(soundType);
            setVisibleNotifications(prev => [...prev, notification]);
        }, 1000 + (index * 1200)); // Delay notifications slightly
        timeouts.push(timeout);
    });

    return () => {
        timeouts.forEach(clearTimeout);
    };

  }, [stepData, gameState, playNotificationSound]);


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
            stepData={stepData}
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
      
      <style>{`
        /* ... animations ... */
      `}</style>

      <button onClick={toggleSound} /* ... */ >
        {/* ... icon ... */}
      </button>

      {/* --- CONTENEDOR DE NOTIFICACIONES GLOBALES --- */}
      <div className="fixed top-24 right-4 z-50 space-y-3 w-full max-w-md">
        {visibleNotifications.map((notification, index) => {
          const key = `notif-${index}`;
          if (notification.type === 'threat') {
            return <ThreatNotification key={key} threat={notification.content} />;
          }
          if (notification.type === 'whatsappNotification' || notification.type === 'smsNotification') {
            return (
              <div key={key} className="animate-slideInRight">
                <NotificationEvent content={notification.content} />
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {renderGameState()}
      </div>
    </div>
  );
};

export default CrisisSimulation;