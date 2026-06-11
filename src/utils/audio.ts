/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class SoundEffects {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    // Lazy initialize to avoid autoplay policy block until first user interaction
  }

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      } catch (e) {
        console.warn('Web Audio API not supported', e);
        this.enabled = false;
      }
    }
    // Resume context if suspended
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggle(force?: boolean) {
    this.enabled = force !== undefined ? force : !this.enabled;
    return this.enabled;
  }

  public isEnabled() {
    return this.enabled;
  }

  public playSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // High-pitched retro success ding
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    // Two-tone rising frequency
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
    osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
    
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.35);
  }

  public playFailure() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Low buzzer fail
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.3);
    
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.32);
  }

  public playWeChatPing() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // WeChat notification sound double ping
    // Simple pure sine wave pings
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    const gain2 = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(987.77, now); // B5
    gain1.gain.setValueAtTime(0.1, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.15);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1046.50, now + 0.08); // C6
    gain2.gain.setValueAtTime(0.1, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.23);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.23);
  }

  public playSwoosh() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Swipe sound, noise-like using rapid frequency ramp
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(450, now + 0.15);
    
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.18);
  }

  public playLevelUp() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Majestic retro level up chime scale
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4, E4, G4, C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      
      gain.gain.setValueAtTime(0.08, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.2);
      
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.2);
    });
  }

  public playClockTick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    
    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.04);
  }
}

export const sfx = new SoundEffects();
