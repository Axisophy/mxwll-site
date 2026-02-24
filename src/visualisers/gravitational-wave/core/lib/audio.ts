/**
 * WebAudio sonification for gravitational wave chirp
 */
export class ChirpAudio {
  private ctx: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;

  constructor() {
    // AudioContext created on first interaction to comply with browser policies
  }

  private ensureContext() {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.gainNode = this.ctx.createGain();
      this.gainNode.connect(this.ctx.destination);
      this.gainNode.gain.value = 0;
    }
  }

  start() {
    if (this.isPlaying) return;

    this.ensureContext();
    if (!this.ctx || !this.gainNode) return;

    this.ctx.resume();
    this.oscillator = this.ctx.createOscillator();
    this.oscillator.type = 'sine';
    this.oscillator.connect(this.gainNode);
    this.oscillator.start();
    this.isPlaying = true;
  }

  update(frequency: number, amplitude: number) {
    if (!this.oscillator || !this.gainNode || !this.ctx) return;

    // Frequency shift: add 200Hz to push into more audible range
    // (raw GW frequency is 35-250 Hz, which is hard to hear on laptop speakers)
    const audibleFreq = Math.max(50, Math.min(frequency + 200, 600));

    this.oscillator.frequency.setTargetAtTime(
      audibleFreq,
      this.ctx.currentTime,
      0.01
    );

    // Amplitude envelope: soft at start, peaks at merger
    this.gainNode.gain.setTargetAtTime(
      Math.min(amplitude * 0.12, 0.25),
      this.ctx.currentTime,
      0.01
    );
  }

  stop() {
    if (!this.gainNode || !this.ctx) return;

    this.gainNode.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);

    setTimeout(() => {
      if (this.oscillator) {
        this.oscillator.stop();
        this.oscillator.disconnect();
        this.oscillator = null;
      }
      this.isPlaying = false;
    }, 100);
  }

  isActive(): boolean {
    return this.isPlaying;
  }

  dispose() {
    this.stop();
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}
