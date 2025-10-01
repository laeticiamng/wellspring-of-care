import { useEffect, useRef } from 'react';
import { Howl } from 'howler';

interface CardSoundConfig {
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export function useCardSounds() {
  const soundsRef = useRef<{
    reveal: Howl | null;
    whoosh: Howl | null;
    shimmer: Howl | null;
    ambient: Howl | null;
  }>({
    reveal: null,
    whoosh: null,
    shimmer: null,
    ambient: null,
  });

  useEffect(() => {
    // Initialize sounds
    soundsRef.current.reveal = new Howl({
      src: ['https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'],
      volume: 0.5,
    });

    soundsRef.current.whoosh = new Howl({
      src: ['https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'],
      volume: 0.3,
    });

    soundsRef.current.shimmer = new Howl({
      src: ['https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3'],
      volume: 0.4,
    });

    soundsRef.current.ambient = new Howl({
      src: ['https://assets.mixkit.co/active_storage/sfx/2995/2995-preview.mp3'],
      volume: 0.2,
      loop: true,
    });

    return () => {
      // Cleanup
      Object.values(soundsRef.current).forEach(sound => sound?.unload());
    };
  }, []);

  const playRevealSound = (config?: CardSoundConfig) => {
    const { rarity = 'common' } = config || {};
    
    // Adjust volume based on rarity
    const volumeMultiplier = {
      common: 1,
      rare: 1.2,
      epic: 1.4,
      legendary: 1.6,
    }[rarity];

    soundsRef.current.whoosh?.play();
    
    setTimeout(() => {
      if (soundsRef.current.reveal) {
        soundsRef.current.reveal.volume(0.5 * volumeMultiplier);
        soundsRef.current.reveal.play();
      }
    }, 500);

    setTimeout(() => {
      soundsRef.current.shimmer?.play();
    }, 1700);
  };

  const playAmbient = () => {
    soundsRef.current.ambient?.play();
  };

  const stopAmbient = () => {
    soundsRef.current.ambient?.stop();
  };

  const playClickSound = () => {
    const click = new Howl({
      src: ['https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'],
      volume: 0.2,
    });
    click.play();
  };

  return {
    playRevealSound,
    playAmbient,
    stopAmbient,
    playClickSound,
  };
}
