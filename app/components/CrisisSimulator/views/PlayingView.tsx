'use client'
import React from 'react';
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { CrisisStep, SoundType } from '@/app/data/crisisSteps';
import WhatsAppGroupEvent from '../events/WhatsAppGroupEvent';
import EmailEvent from '../events/EmailEvent';
import MixedEvent from '../events/MixedEvent';
import EventEvent from '../events/EventEvent';
import InstructionsEvent from '../events/InstructionsEvent';
import TransitionEvent from '../events/TransitionEvent';
import BreakingNewEvent from '../events/BreakingNewEvent';
import WhatsAppChatEvent from '../events/WhatsAppChatEvent';
import HeadingNewEvent from '../events/HeadingNewEvent';
import NotificationEvent from '../events/NotificationEvent';
import AlertEvent from '../events/AlertEvent';
import TwitterPostEvent from '../events/TwitterPostEvent';

interface PlayingViewProps {
  crisisName: string;
  currentStep: number;
  totalSteps: number;
  stepData: CrisisStep;
  playNotificationSound: (type: SoundType | string) => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  onOptionSelect: (optionId: string) => void;
}

const PlayingView: React.FC<PlayingViewProps> = ({
  crisisName,
  currentStep,
  totalSteps,
  stepData,
  playNotificationSound,
  onPrevStep,
  onNextStep,
  onOptionSelect,
}) => {
  const renderEventComponent = () => {
    switch (stepData.type) {
      case 'whatsappGroup':
        return <WhatsAppGroupEvent messages={stepData.content.messages} playNotificationSound={playNotificationSound} />;
      case 'email':
        return <EmailEvent content={stepData.content} playNotificationSound={playNotificationSound} />;
      case 'mixed':
        return <MixedEvent content={stepData.content} playNotificationSound={playNotificationSound} onOptionSelect={onOptionSelect} />;
      case 'event':
        return <EventEvent content={stepData.content} playNotificationSound={playNotificationSound} />;
      case 'instructions':
        return <InstructionsEvent content={stepData.content} />;
      case 'transition':
        return <TransitionEvent content={stepData.content} onOptionSelect={onOptionSelect} />;
      case 'breaking-new':
        return <BreakingNewEvent content={stepData.content} />;
      case 'whatsapp-chat':
        return <WhatsAppChatEvent content={stepData.content} />;
      case 'headingNew':
        return <HeadingNewEvent content={stepData.content} />;
      case 'whatsappNotification':
      case 'smsNotification':
        return <NotificationEvent content={stepData.content} />;
                case 'alert':
                  return <AlertEvent content={stepData.content} />;
                case 'twitterPost':
                  return <TwitterPostEvent content={stepData.content} />;      default:
        return null;
    }
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-2xl capitalize  text-(--red-tpm) font-bold mb-1">{crisisName}</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-(--gray-tpm) px-4 py-2 rounded-lg font-mono text-white  flex items-center gap-2">
               <Clock size={16} /> {stepData.time}
            </div>
            <div className="text-lg text-(--black-tpm) font-light  px-3 py-2 rounded-lg">
              Paso {currentStep + 1} / {totalSteps}
            </div>
          </div>
        </div>
        <div className="w-full bg-[#D2EAEA] rounded-full h-3 overflow-hidden">
          <div 
            className="bg-(--red-tpm) h-full transition-all duration-700 ease-out"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Dynamic Content */}
      <div key={currentStep} className="bg-white backdrop-blur-md rounded-3xl p-8 border border-slate-700 min-h-[500px] shadow-2xl relative overflow-hidden">
        <h2 className="text-3xl font-bold mb-6 text-(--black-tpm) border-b border-slate-700 pb-4">
          {stepData.title}
        </h2>
        
        <div className="mt-6">
          {renderEventComponent()}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button 
          onClick={onPrevStep}
          disabled={currentStep === 0}
          className="bg-[#e5f5f5] flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed  text-(--black-tpm) hover:scale-105"
        >
          <ArrowLeft size={20} /> Anterior
        </button>
        <button 
          onClick={onNextStep}
          className="bg-(--red-tpm) px-8 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
        >
          {currentStep === totalSteps - 1 ? 'Tomar Decisiones' : 'Siguiente'} <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default PlayingView;
