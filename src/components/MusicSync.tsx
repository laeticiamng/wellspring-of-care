import { useEffect, useRef, useState } from 'react';
import Howler from 'howler';

interface MusicSyncProps {
  musicUrl: string;
  onAudioLevel?: (level: number) => void;
  onEnded?: () => void;
}

export function MusicSync({ musicUrl, onAudioLevel, onEnded }: MusicSyncProps) {
  const soundRef = useRef<Howl | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!musicUrl) return;

    // Créer Howl sound
    const sound = new Howl({
      src: [musicUrl],
      html5: true,
      onload: () => {
        console.log('Musique chargée');
      },
      onend: () => {
        setIsPlaying(false);
        onEnded?.();
      },
      onloaderror: (id, error) => {
        console.error('Erreur chargement musique:', error);
      },
    });

    soundRef.current = sound;

    // Créer analyseur audio (Web Audio API)
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;

    // Connecter Howl à analyser (nécessite accès au node audio de Howl)
    // Note: Howl n'expose pas directement le node, donc on utilise une approche simplifiée
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const analyzeAudio = () => {
      if (analyserRef.current && isPlaying) {
        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Calculer niveau moyen (basses principalement)
        const bassValues = dataArray.slice(0, 10);
        const avgBass = bassValues.reduce((a, b) => a + b, 0) / bassValues.length;
        const normalizedLevel = avgBass / 255;

        onAudioLevel?.(normalizedLevel);
      }

      animationRef.current = requestAnimationFrame(analyzeAudio);
    };

    // Démarrer lecture automatiquement
    sound.play();
    setIsPlaying(true);
    analyzeAudio();

    return () => {
      sound.unload();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      audioContext.close();
    };
  }, [musicUrl, onAudioLevel, onEnded, isPlaying]);

  return null; // Composant invisible, gère seulement l'audio
}
