import { Howl } from 'howler';

class BreathSoundManager {
  private inhaleSound: Howl;
  private exhaleSound: Howl;
  private ambientSound: Howl;
  private isMuted: boolean = false;

  constructor() {
    // Créer des sons synthétiques avec des fréquences
    this.inhaleSound = new Howl({
      src: [this.generateInhaleSound()],
      volume: 0.4,
      html5: true,
    });

    this.exhaleSound = new Howl({
      src: [this.generateExhaleSound()],
      volume: 0.4,
      html5: true,
    });

    this.ambientSound = new Howl({
      src: [this.generateAmbientSound()],
      volume: 0.2,
      loop: true,
      html5: true,
    });
  }

  private generateInhaleSound(): string {
    // Génère un son de montée (cristallin)
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const duration = 5;
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const frequency = 200 + (t / duration) * 400; // Monte de 200Hz à 600Hz
      data[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t / 2) * 0.3;
    }

    return this.bufferToDataURL(buffer);
  }

  private generateExhaleSound(): string {
    // Génère un son de descente (apaisant)
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const duration = 5;
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const frequency = 600 - (t / duration) * 400; // Descend de 600Hz à 200Hz
      data[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t / 1.5) * 0.3;
    }

    return this.bufferToDataURL(buffer);
  }

  private generateAmbientSound(): string {
    // Son ambiant doux (basse fréquence)
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const duration = 10;
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      data[i] = Math.sin(2 * Math.PI * 80 * t) * 0.1 + 
                Math.sin(2 * Math.PI * 120 * t) * 0.1;
    }

    return this.bufferToDataURL(buffer);
  }

  private bufferToDataURL(buffer: AudioBuffer): string {
    const wav = this.audioBufferToWav(buffer);
    const blob = new Blob([wav], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  }

  private audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
    const length = buffer.length * buffer.numberOfChannels * 2 + 44;
    const arrayBuffer = new ArrayBuffer(length);
    const view = new DataView(arrayBuffer);
    const channels = [];
    let offset = 0;
    let pos = 0;

    // Write WAV header
    const setUint16 = (data: number) => {
      view.setUint16(pos, data, true);
      pos += 2;
    };
    const setUint32 = (data: number) => {
      view.setUint32(pos, data, true);
      pos += 4;
    };

    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8);
    setUint32(0x45564157); // "WAVE"
    setUint32(0x20746d66); // "fmt "
    setUint32(16);
    setUint16(1);
    setUint16(buffer.numberOfChannels);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * buffer.numberOfChannels);
    setUint16(buffer.numberOfChannels * 2);
    setUint16(16);
    setUint32(0x61746164); // "data"
    setUint32(length - pos - 4);

    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    while (pos < length) {
      for (let i = 0; i < buffer.numberOfChannels; i++) {
        let sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        view.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }

    return arrayBuffer;
  }

  playInhale() {
    if (!this.isMuted) {
      this.inhaleSound.play();
    }
  }

  playExhale() {
    if (!this.isMuted) {
      this.exhaleSound.play();
    }
  }

  startAmbient() {
    if (!this.isMuted) {
      this.ambientSound.play();
    }
  }

  stopAmbient() {
    this.ambientSound.stop();
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAmbient();
    }
  }

  cleanup() {
    this.inhaleSound.unload();
    this.exhaleSound.unload();
    this.ambientSound.unload();
  }
}

export const breathSounds = new BreathSoundManager();
