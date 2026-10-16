const Audio = {
  ctx: null,
  masterGain: null,
  activeSources: [],

  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn('Web Audio API not available');
    }
  },

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  playTide() {
    if (!this.ctx) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    filter.Q.value = 1;

    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.1;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 100;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    const gain = this.ctx.createGain();
    gain.gain.value = 0.15;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    source.start();

    this.activeSources.push({ source, lfo, gain });
  },

  playDrone() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 55;

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 57;

    const gain = this.ctx.createGain();
    gain.gain.value = 0.05;

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc2.start();

    this.activeSources.push({ source: osc, source2: osc2, gain });
  },

  playWhisper() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const env = Math.sin(Math.PI * i / bufferSize);
      data[i] = (Math.random() * 2 - 1) * env * 0.3;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 800;
    filter.Q.value = 5;

    const gain = this.ctx.createGain();
    gain.gain.value = 0.08;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    source.start();
  },

  playClick() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 800;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  },

  playDrip() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.15);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  },

  stopAll() {
    this.activeSources.forEach(s => {
      try {
        s.source.stop();
        if (s.source2) s.source2.stop();
        if (s.lfo) s.lfo.stop();
      } catch (e) {}
    });
    this.activeSources = [];
  },

  setVolume(v) {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, v));
    }
  }
};

document.addEventListener('click', () => Audio.resume(), { once: true });
