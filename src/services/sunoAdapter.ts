import type { SunoTexture, SunoTempo } from '@/types/assessment';

interface SunoTrack {
  url: string;
  tempo?: SunoTempo;
  texture: SunoTexture;
}

export class SunoAdapter {
  private fallbackTracks: Record<SunoTexture, string> = {
    ambient_soft: '/audio/ambient-soft.mp3',
    calm_low: '/audio/calm-low.mp3',
    sleep_drone: '/audio/sleep-drone.mp3',
    space_pad: '/audio/space-pad.mp3',
    retro_jingle: '/audio/retro-jingle.mp3',
  };

  constructor(private apiKey?: string) {}

  async generateTrack(
    texture: SunoTexture,
    tempo: SunoTempo = 'mid',
    durationSec = 120
  ): Promise<SunoTrack> {
    if (!this.apiKey) {
      console.warn('Suno API key not configured, using fallback audio');
      return {
        url: this.fallbackTracks[texture],
        tempo,
        texture,
      };
    }

    try {
      // Suno API call would go here
      // For now, return fallback
      console.log('Suno generateTrack:', { texture, tempo, durationSec });
      
      return {
        url: this.fallbackTracks[texture],
        tempo,
        texture,
      };
    } catch (error) {
      console.error('Suno generateTrack error:', error);
      return {
        url: this.fallbackTracks[texture],
        tempo,
        texture,
      };
    }
  }

  async morphTrack(
    trackUrl: string,
    target: Partial<{ texture: SunoTexture; tempo: SunoTempo }>
  ): Promise<SunoTrack> {
    if (!this.apiKey) {
      console.warn('Suno API key not configured, using original track');
      return {
        url: trackUrl,
        tempo: target.tempo,
        texture: target.texture || 'ambient_soft',
      };
    }

    try {
      // Suno morph API call would go here
      console.log('Suno morphTrack:', { trackUrl, target });
      
      return {
        url: trackUrl,
        tempo: target.tempo,
        texture: target.texture || 'ambient_soft',
      };
    } catch (error) {
      console.error('Suno morphTrack error:', error);
      return {
        url: trackUrl,
        tempo: target.tempo,
        texture: target.texture || 'ambient_soft',
      };
    }
  }

  getTexturePrompt(texture: SunoTexture): string {
    const prompts: Record<SunoTexture, string> = {
      ambient_soft: 'soft ambient pad, gentle, calming, 60 BPM',
      calm_low: 'low frequency calming tones, meditation, 55 BPM',
      sleep_drone: 'deep sleep drone, very low, 40 BPM',
      space_pad: 'spacious ambient pad, cosmic, ethereal, 65 BPM',
      retro_jingle: 'retro game jingle, positive, short',
    };
    return prompts[texture];
  }
}
