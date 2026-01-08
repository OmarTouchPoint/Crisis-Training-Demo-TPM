'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { MixedContent, CrisisStep, SoundType } from '@/app/data/crisisSteps';

import WhatsAppGroupEvent from './WhatsAppGroupEvent';
import EmailEvent from './EmailEvent';
import EventEvent from './EventEvent';
import InstructionsEvent from './InstructionsEvent';
import TransitionEvent from './TransitionEvent';
import BreakingNewEvent from './BreakingNewEvent';
import WhatsAppChatEvent from './WhatsAppChatEvent';
import AlertEvent from './AlertEvent';
import TwitterPostEvent from './TwitterPostEvent';
import HeadingNewEvent from './HeadingNewEvent';

interface MixedEventProps {
  content: MixedContent;
  playNotificationSound: (type: SoundType | string) => void;
  onOptionSelect: (optionId: string) => void;
  onSequenceComplete?: () => void;
}

const MixedEvent: React.FC<MixedEventProps> = ({ content, playNotificationSound, onOptionSelect, onSequenceComplete }) => {
  const [subStepIndex, setSubStepIndex] = useState(0);

  // Filter out notifications, which are handled globally
  const mainSteps = content.steps.filter(
    step => step.type !== 'whatsappNotification' && step.type !== 'smsNotification'
  );

  const handleSequenceComplete = useCallback(() => {
    if (subStepIndex < mainSteps.length - 1) {
      setSubStepIndex(prev => prev + 1);
    } else {
      onSequenceComplete?.(); // All sub-steps in this mixed event are done
    }
  }, [subStepIndex, mainSteps.length, onSequenceComplete]);

  // If there are no main steps, complete immediately.
  useEffect(() => {
    if (mainSteps.length === 0) {
      onSequenceComplete?.();
    }
  }, [mainSteps.length, onSequenceComplete]);

  const renderNestedStep = (step: CrisisStep, index: number) => {
    const key = `${step.type}-${index}`;
    const isLastVisibleStep = index === subStepIndex;

    // Pass the callback only to the last step in the current sequence
    const props = {
      onSequenceComplete: isLastVisibleStep ? handleSequenceComplete : undefined,
    };

    switch (step.type) {
      case 'whatsappGroup':
        return <WhatsAppGroupEvent key={key} messages={step.content.messages} playNotificationSound={playNotificationSound} {...props} />;
      case 'email':
        return <EmailEvent key={key} content={step.content} playNotificationSound={playNotificationSound} {...props}/>;
      case 'mixed':
        return <MixedEvent key={key} content={step.content} playNotificationSound={playNotificationSound} onOptionSelect={onOptionSelect} {...props} />;
      case 'event':
        return <EventEvent key={key} content={step.content} playNotificationSound={playNotificationSound} {...props} />;
      case 'instructions':
        return <InstructionsEvent key={key} content={step.content} {...props} />;
      case 'transition':
        // Transitions halt the sequence, so they don't get the callback.
        return <TransitionEvent key={key} content={step.content} onOptionSelect={onOptionSelect} />;
      case 'breaking-new':
        return <BreakingNewEvent key={key} content={step.content} {...props} />;
      case 'whatsapp-chat':
        return <WhatsAppChatEvent 
                  key={key}
                  messages={step.content.messages}
                  chatPerfilImg={step.content.chatPerfilImg}
                  chatPerfilName={step.content.chatPerfilName}
                  playNotificationSound={playNotificationSound} 
                  {...props} 
                />;
      case 'headingNew':
          return <HeadingNewEvent key={key} content={step.content} playNotificationSound={playNotificationSound} {...props} />;
      case 'alert':
        return <AlertEvent key={key} content={step.content} playNotificationSound={playNotificationSound} {...props} />;
      case 'twitterPost':
        return <TwitterPostEvent key={key} content={step.content} playNotificationSound={playNotificationSound} {...props} />;
      default:
        return null;
    }
  };
  
  const stepsToRender = mainSteps.slice(0, subStepIndex + 1);

  return (
    <div className="space-y-6">
      {stepsToRender.map((step, index) => (
        <div key={`main-${index}`}>
          {renderNestedStep(step, index)}
        </div>
      ))}
    </div>
  );
};

export default MixedEvent;
