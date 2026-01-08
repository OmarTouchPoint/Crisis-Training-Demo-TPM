import { useState, useCallback } from 'react';
import { SoundType } from '@/app/data/crisisSteps';

// Extender la interfaz Window para webkitAudioContext
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export const useSound = (soundEnabled: boolean) => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const initAudio = () => {
    let ctx = audioContext;
    if (!ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        ctx = new AudioContext();
        setAudioContext(ctx);
      }
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
  };

  const playNotificationSound = useCallback((type: SoundType | string) => {
    if (!soundEnabled || !audioContext) return;

    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const now = audioContext.currentTime;

    switch (type) {
      case 'whatsapp': // Combined whatsappGroup and single whatsapp sound
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1600, now + 0.15);
        gainNode.gain.setValueAtTime(0.05, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
        break;
      
      case 'sms': // Doble beep electrónico
        osc.type = 'square';
        // Primer beep
        osc.frequency.setValueAtTime(800, now);
        gainNode.gain.setValueAtTime(0.05, now);
        gainNode.gain.setValueAtTime(0, now + 0.08);
        
        // Segundo beep (simplificado)
        osc.frequency.setValueAtTime(800, now + 0.1);
        gainNode.gain.setValueAtTime(0.05, now + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        
        osc.start(now);
        osc.stop(now + 0.2);
        break;

      case 'email': // Ding suave y resonante
        osc.type = 'sine';
        osc.frequency.setValueAtTime(550, now);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
        break;

      case 'alert': // Tono de advertencia grave
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.4);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
      
      case 'tweet': // Pop muy corto y agudo (tipo gota de agua)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);
        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;

      case 'explosion': // Sound for the event
        osc.type = 'sawtooth'; 
        osc.frequency.setValueAtTime(50, now);
        osc.frequency.exponentialRampToValueAtTime(10, now + 0.8);
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
        break;

      default:
        break;
    }
  }, [soundEnabled, audioContext]);

  return { initAudio, playNotificationSound };
};
