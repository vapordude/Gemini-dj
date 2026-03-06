export class AudioEngine {
  private static instance: AudioEngine;
  public context: AudioContext | null = null;
  public masterGain: GainNode | null = null;
  public limiter: DynamicsCompressorNode | null = null;
  public analyser: AnalyserNode | null = null;

  private constructor() {}

  public static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  public init() {
    if (this.context) return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.context = new AudioContextClass();
    
    // Create Nodes
    this.masterGain = this.context.createGain();
    this.limiter = this.context.createDynamicsCompressor();
    this.analyser = this.context.createAnalyser();

    // Configure Limiter (Safety)
    this.limiter.threshold.setValueAtTime(-1.0, this.context.currentTime); // -1dB
    this.limiter.knee.setValueAtTime(0.0, this.context.currentTime); // Hard knee
    this.limiter.ratio.setValueAtTime(20.0, this.context.currentTime); // High ratio (limiting)
    this.limiter.attack.setValueAtTime(0.005, this.context.currentTime); // Fast attack
    this.limiter.release.setValueAtTime(0.050, this.context.currentTime); // Fast release

    // Connect Chain: Master -> Limiter -> Analyser -> Destination
    this.masterGain.connect(this.limiter);
    this.limiter.connect(this.analyser);
    this.analyser.connect(this.context.destination);

    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.8;
  }

  public resume() {
    if (this.context?.state === 'suspended') {
      this.context.resume().catch(err => console.error("Failed to resume AudioContext:", err));
    }
  }
}
