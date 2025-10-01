import { useState, useCallback } from 'react';
import { SunoAdapter } from '@/services/sunoAdapter';
import type { SunoTexture, SunoTempo } from '@/types/assessment';

export function useAudioSuno() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  // Read API key from environment (would be configured in .env)
  const apiKey = import.meta.env.VITE_SUNO_API_KEY;
  const suno = new SunoAdapter(apiKey);

  const play = useCallback(
    async (
      texture: SunoTexture,
      tempo: SunoTempo = 'mid',
      durationSec = 120
    ): Promise<HTMLAudioElement> => {
      // Stop current audio if playing
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      const { url } = await suno.generateTrack(texture, tempo, durationSec);
      const audio = new Audio(url);
      audio.loop = false;

      audio.addEventListener('play', () => setIsPlaying(true));
      audio.addEventListener('pause', () => setIsPlaying(false));
      audio.addEventListener('ended', () => setIsPlaying(false));

      setCurrentAudio(audio);
      
      try {
        await audio.play();
      } catch (error) {
        console.error('Audio play error:', error);
      }

      return audio;
    },
    [currentAudio, suno]
  );

  const stop = useCallback(() => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
    }
  }, [currentAudio]);

  const pause = useCallback(() => {
    if (currentAudio) {
      currentAudio.pause();
    }
  }, [currentAudio]);

  const resume = useCallback(() => {
    if (currentAudio) {
      currentAudio.play().catch(console.error);
    }
  }, [currentAudio]);

  return {
    play,
    stop,
    pause,
    resume,
    isPlaying,
    currentAudio,
  };
}
