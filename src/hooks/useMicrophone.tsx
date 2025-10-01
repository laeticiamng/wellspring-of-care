import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useMicrophone() {
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [breathLevel, setBreathLevel] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      
      streamRef.current = stream;
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 512;
      analyserRef.current.smoothingTimeConstant = 0.8;

      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      setIsActive(true);
      setIsListening(true);
      analyzeBreath();

      toast({
        title: '🎤 Micro activé',
        description: 'Je synchronise avec ta respiration',
      });
    } catch (error) {
      console.error('Erreur microphone:', error);
      toast({
        title: 'Erreur micro',
        description: 'Impossible d\'accéder au microphone',
        variant: 'destructive',
      });
    }
  };

  const analyzeBreath = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const analyze = () => {
      if (!analyserRef.current || !isListening) return;

      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Analyser les basses fréquences (respiration)
      const lowFreqs = dataArray.slice(0, 20);
      const average = lowFreqs.reduce((a, b) => a + b, 0) / lowFreqs.length;
      const normalized = Math.min(1, average / 128);
      
      setBreathLevel(normalized);
      
      animationFrameRef.current = requestAnimationFrame(analyze);
    };

    analyze();
  };

  const stopListening = () => {
    setIsListening(false);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    setIsActive(false);
    setBreathLevel(0);

    toast({
      title: '🎤 Micro désactivé',
      description: 'Retour au mode guidé',
    });
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    isActive,
    isListening,
    breathLevel,
    startListening,
    stopListening,
  };
}
