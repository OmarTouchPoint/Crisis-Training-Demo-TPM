'use client'
import React from 'react';
import { AlertTriangle, MessageCircle, Smartphone } from 'lucide-react';
import { MixedContent, CrisisStep, SoundType } from '@/app/data/crisisSteps';

import WhatsAppGroupEvent from './WhatsAppGroupEvent';
import EmailEvent from './EmailEvent';
import EventEvent from './EventEvent';
import InstructionsEvent from './InstructionsEvent';
import TransitionEvent from './TransitionEvent';
import BreakingNewEvent from './BreakingNewEvent';
import WhatsAppChatEvent from './WhatsAppChatEvent';
import NotificationEvent from './NotificationEvent';
import AlertEvent from './AlertEvent';

interface MixedEventProps {
  content: MixedContent;
  playNotificationSound: (type: SoundType | string) => void;
  onOptionSelect: (optionId: string) => void;
}

const MixedEvent: React.FC<MixedEventProps> = ({ content, playNotificationSound, onOptionSelect }) => {

  const renderNestedStep = (step: CrisisStep, index: number) => {
    switch (step.type) {
      case 'whatsappGroup':
        return <WhatsAppGroupEvent key={index} messages={step.content.messages} playNotificationSound={playNotificationSound} />;
      case 'email':
        return <EmailEvent key={index} content={step.content} playNotificationSound={playNotificationSound} />;
      case 'mixed':
        // Recursive rendering for nested mixed steps, though generally not recommended for deep nesting
        return <MixedEvent key={index} content={step.content} playNotificationSound={playNotificationSound} onOptionSelect={onOptionSelect} />;
      case 'event':
        return <EventEvent key={index} content={step.content} playNotificationSound={playNotificationSound} />;
      case 'instructions':
        return <InstructionsEvent key={index} content={step.content} />;
      case 'transition':
        return <TransitionEvent key={index} content={step.content} onOptionSelect={onOptionSelect} />;
      case 'breaking-new':
        return <BreakingNewEvent key={index} content={step.content} />;
      case 'whatsapp-chat':
        return <WhatsAppChatEvent key={index} content={step.content} />;
      case 'whatsappNotification':
      case 'smsNotification':
        return <NotificationEvent key={index} content={step.content} />;
      case 'alert':
        return <AlertEvent key={index} content={step.content} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {content.steps.map((step, index) => (
        <div key={index} className="animate-fadeIn" style={{ animationDelay: `${index * 0.2}s` }}>
          {renderNestedStep(step, index)}
        </div>
      ))}
    </div>
  );
};

export default MixedEvent;
