import type { HumeSignals } from '@/types/assessment';

export class HumeAdapter {
  constructor(private apiKey?: string) {}

  async inferFromVoice(stream: MediaStream): Promise<HumeSignals> {
    if (!this.apiKey) {
      console.warn('Hume API key not configured, returning neutral signals');
      return this.getNeutralSignals();
    }

    try {
      // Hume voice API would process the MediaStream here
      // For now, return mock signals
      console.log('Hume inferFromVoice called');
      
      // Simulate some basic processing
      await this.delay(500);
      
      return {
        arousal: 0.32,
        stress: 0.18,
        valence: 0.45,
      };
    } catch (error) {
      console.error('Hume inferFromVoice error:', error);
      return this.getNeutralSignals();
    }
  }

  async inferFromFace(frame: HTMLVideoElement): Promise<HumeSignals> {
    if (!this.apiKey) {
      console.warn('Hume API key not configured, returning neutral signals');
      return this.getNeutralSignals();
    }

    try {
      // Hume face API would process video frame here
      console.log('Hume inferFromFace called');
      
      await this.delay(300);
      
      return {
        valence: 0.41,
        arousal: 0.28,
      };
    } catch (error) {
      console.error('Hume inferFromFace error:', error);
      return this.getNeutralSignals();
    }
  }

  async inferFromText(text: string): Promise<HumeSignals> {
    if (!this.apiKey) {
      console.warn('Hume API key not configured, returning neutral signals');
      return this.getNeutralSignals();
    }

    try {
      // Hume text sentiment API would process text here
      console.log('Hume inferFromText called:', text.substring(0, 50));
      
      // Simple heuristic for demo
      const lowerText = text.toLowerCase();
      const hasPositiveWords = /bien|super|content|heureux|joie/i.test(lowerText);
      const hasNegativeWords = /mal|triste|peur|anxieux|stress/i.test(lowerText);
      
      return {
        valence: hasPositiveWords ? 0.6 : hasNegativeWords ? 0.2 : 0.4,
        arousal: text.length > 100 ? 0.25 : 0.15,
      };
    } catch (error) {
      console.error('Hume inferFromText error:', error);
      return this.getNeutralSignals();
    }
  }

  private getNeutralSignals(): HumeSignals {
    return {
      valence: 0.5,
      arousal: 0.3,
      tension: 0.3,
      fatigue: 0.3,
      stress: 0.3,
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Helper to smooth signals over time
  smoothSignals(current: HumeSignals, previous: HumeSignals, alpha = 0.3): HumeSignals {
    const smooth = (curr: number | undefined, prev: number | undefined): number | undefined => {
      if (curr === undefined || prev === undefined) return curr || prev;
      return alpha * curr + (1 - alpha) * prev;
    };

    return {
      valence: smooth(current.valence, previous.valence),
      arousal: smooth(current.arousal, previous.arousal),
      tension: smooth(current.tension, previous.tension),
      fatigue: smooth(current.fatigue, previous.fatigue),
      stress: smooth(current.stress, previous.stress),
    };
  }
}
