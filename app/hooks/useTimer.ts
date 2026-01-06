import { useState, useEffect } from 'react';
import { GameState } from '@/app/data/crisisSteps';

export const useTimer = (
  gameState: GameState,
  initialTime: number,
  onTimeEnd: () => void
) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(initialTime);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (gameState === 'decision' && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && gameState === 'decision') {
      onTimeEnd();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState, timeRemaining, onTimeEnd]);

  const resetTimer = () => {
    setTimeRemaining(initialTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return { timeRemaining, formatTime, resetTimer };
};
