import { HumeAdapter } from '@/services/humeAdapter';
import type { HumeSignals } from '@/types/assessment';

export function useHumeSignals() {
  // Read API key from environment (would be configured in .env)
  const apiKey = import.meta.env.VITE_HUME_API_KEY;
  const hume = new HumeAdapter(apiKey);

  const fromVoice = async (stream: MediaStream): Promise<HumeSignals> => {
    return await hume.inferFromVoice(stream);
  };

  const fromFace = async (video: HTMLVideoElement): Promise<HumeSignals> => {
    return await hume.inferFromFace(video);
  };

  const fromText = async (text: string): Promise<HumeSignals> => {
    return await hume.inferFromText(text);
  };

  const smooth = (current: HumeSignals, previous: HumeSignals, alpha = 0.3): HumeSignals => {
    return hume.smoothSignals(current, previous, alpha);
  };

  return {
    fromVoice,
    fromFace,
    fromText,
    smooth,
  };
}
