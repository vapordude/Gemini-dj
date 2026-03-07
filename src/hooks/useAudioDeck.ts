import { useState, useEffect, useRef } from 'react';
import { AudioEngine } from '../lib/AudioEngine';

export interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: number;
  url?: string;
  bpm?: number;
  key?: string;
  energy?: string;
  genre?: string;
}

export interface DeckState {
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  track: Track | null;
  filterFreq: number; // 0..22000
  filterRes: number; // 0..20
  delayWet: number; // 0..1
  eqLow: number; // -20..10
  eqMid: number; // -20..10
  eqHigh: number; // -20..10
  playbackRate: number;
  isLooping: boolean;
  loopStart: number | null;
  loopLength: number | null;
}

export function useAudioDeck(initialVolume = 1.0) {
  const [state, setState] = useState<DeckState>({
    isPlaying: false,
    volume: initialVolume,
    currentTime: 0,
    duration: 0,
    track: null,
    filterFreq: 22000,
    filterRes: 0,
    delayWet: 0,
    eqLow: 0,
    eqMid: 0,
    eqHigh: 0,
    playbackRate: 1.0,
    isLooping: false,
    loopStart: null,
    loopLength: null,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  // ... (refs)

  // ... (useEffect for init)

  // Loop Check Interval
  useEffect(() => {
    if (!state.isLooping || state.loopStart === null || state.loopLength === null || !audioRef.current) return;

    const checkLoop = () => {
        if (!audioRef.current) return;
        const loopEnd = (state.loopStart || 0) + (state.loopLength || 0);
        if (audioRef.current.currentTime >= loopEnd) {
            audioRef.current.currentTime = state.loopStart || 0;
        }
    };

    const interval = setInterval(checkLoop, 50); // High frequency check
    return () => clearInterval(interval);
  }, [state.isLooping, state.loopStart, state.loopLength]);


  const loadTrack = async (track: Track) => {
    if (!audioRef.current) return;
    
    engine.init();
    engine.resume();

    // Fetch Analysis if missing
    let analyzedTrack = { ...track };
    if (!track.bpm) {
        try {
            const res = await fetch('/api/analyze-track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: track.title, artist: track.artist })
            });
            const analysis = await res.json();
            analyzedTrack = { ...track, ...analysis };
        } catch (e) {
            console.error("Analysis failed", e);
        }
    }

    const streamUrl = `/api/stream/${track.id}`;
    audioRef.current.src = streamUrl;
    audioRef.current.load();
    
    setState(prev => ({ 
        ...prev, 
        track: analyzedTrack, 
        isPlaying: false, 
        currentTime: 0,
        playbackRate: 1.0,
        isLooping: false,
        loopStart: null,
        loopLength: null
    }));
  };

  // ... (play, pause, setVolume, seek)

  const setPlaybackRate = (rate: number) => {
      if (audioRef.current) {
          audioRef.current.playbackRate = rate;
          setState(prev => ({ ...prev, playbackRate: rate }));
      }
  };

  const toggleLoop = (length: number) => { // length in seconds (e.g., 4 beats at 120bpm = 2s)
      if (state.isLooping) {
          setState(prev => ({ ...prev, isLooping: false, loopStart: null, loopLength: null }));
      } else {
          const start = audioRef.current?.currentTime || 0;
          setState(prev => ({ ...prev, isLooping: true, loopStart: start, loopLength: length }));
      }
  };

  // ... (FX Controls)

  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  
  // Effects Nodes
  const eqLowRef = useRef<BiquadFilterNode | null>(null);
  const eqMidRef = useRef<BiquadFilterNode | null>(null);
  const eqHighRef = useRef<BiquadFilterNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const delayNodeRef = useRef<DelayNode | null>(null);
  const delayGainRef = useRef<GainNode | null>(null);
  const dryGainRef = useRef<GainNode | null>(null);

  const engine = AudioEngine.getInstance();

  useEffect(() => {
    // Initialize audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = "anonymous";
    }

    // Initialize Web Audio nodes
    if (engine.context && !sourceNodeRef.current) {
      const ctx = engine.context;
      
      // Create Nodes
      sourceNodeRef.current = ctx.createMediaElementSource(audioRef.current);
      gainNodeRef.current = ctx.createGain();
      
      // EQ Nodes
      eqLowRef.current = ctx.createBiquadFilter();
      eqMidRef.current = ctx.createBiquadFilter();
      eqHighRef.current = ctx.createBiquadFilter();
      
      filterNodeRef.current = ctx.createBiquadFilter();
      delayNodeRef.current = ctx.createDelay(5.0);
      delayGainRef.current = ctx.createGain();
      dryGainRef.current = ctx.createGain();

      // Configure EQ
      eqLowRef.current.type = 'lowshelf';
      eqLowRef.current.frequency.value = 320; // Bass cutoff
      eqLowRef.current.gain.value = 0;

      eqMidRef.current.type = 'peaking';
      eqMidRef.current.frequency.value = 1000; // Mid center
      eqMidRef.current.Q.value = 1;
      eqMidRef.current.gain.value = 0;

      eqHighRef.current.type = 'highshelf';
      eqHighRef.current.frequency.value = 3200; // High cutoff
      eqHighRef.current.gain.value = 0;

      // Configure Filter (Lowpass by default, can sweep)
      filterNodeRef.current.type = 'lowpass';
      filterNodeRef.current.frequency.value = 22000;
      filterNodeRef.current.Q.value = 1;

      // Configure Delay
      delayNodeRef.current.delayTime.value = 0.5; // 500ms delay
      delayGainRef.current.gain.value = 0; // Start dry
      dryGainRef.current.gain.value = 1;

      // Routing:
      // Source -> EQ Low -> EQ Mid -> EQ High -> Filter -> Gain -> Split (Dry / Wet) -> Master
      
      sourceNodeRef.current
        .connect(eqLowRef.current)
        .connect(eqMidRef.current)
        .connect(eqHighRef.current)
        .connect(filterNodeRef.current)
        .connect(gainNodeRef.current);

      // Gain -> Dry -> Master
      gainNodeRef.current.connect(dryGainRef.current);
      dryGainRef.current.connect(engine.masterGain!);

      // Gain -> Delay -> Delay Gain -> Master
      gainNodeRef.current.connect(delayNodeRef.current);
      delayNodeRef.current.connect(delayGainRef.current);
      delayGainRef.current.connect(engine.masterGain!);
      
      gainNodeRef.current.gain.value = initialVolume;
    }

    // Event listeners
    const audio = audioRef.current;
    if (!audio) return;
    
    const onTimeUpdate = () => {
      setState(prev => ({ ...prev, currentTime: audio.currentTime }));
    };
    
    const onDurationChange = () => {
      setState(prev => ({ ...prev, duration: audio.duration }));
    };
    
    const onEnded = () => {
      setState(prev => ({ ...prev, isPlaying: false }));
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
    };
  }, [engine.context]);

  const play = () => {
    if (audioRef.current) {
      engine.resume();
      audioRef.current.play().catch(e => console.error("Play failed:", e));
      setState(prev => ({ ...prev, isPlaying: true }));
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
    }
  };

  const setVolume = (vol: number) => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = vol;
      setState(prev => ({ ...prev, volume: vol }));
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setState(prev => ({ ...prev, currentTime: time }));
    }
  };

  // FX Controls
  const setFilter = (freq: number, res: number = 1) => {
      if (filterNodeRef.current) {
          const f = Math.max(20, Math.min(22000, freq));
          filterNodeRef.current.frequency.setTargetAtTime(f, engine.context!.currentTime, 0.1);
          filterNodeRef.current.Q.setTargetAtTime(res, engine.context!.currentTime, 0.1);
          setState(prev => ({ ...prev, filterFreq: f, filterRes: res }));
      }
  };

  const setEQ = (band: 'low' | 'mid' | 'high', gain: number) => {
      const ctx = engine.context;
      if (!ctx) return;
      
      if (band === 'low') {
          if (eqLowRef.current) eqLowRef.current.gain.setTargetAtTime(gain, ctx.currentTime, 0.1);
          setState(prev => ({ ...prev, eqLow: gain }));
      } else if (band === 'mid') {
          if (eqMidRef.current) eqMidRef.current.gain.setTargetAtTime(gain, ctx.currentTime, 0.1);
          setState(prev => ({ ...prev, eqMid: gain }));
      } else if (band === 'high') {
          if (eqHighRef.current) eqHighRef.current.gain.setTargetAtTime(gain, ctx.currentTime, 0.1);
          setState(prev => ({ ...prev, eqHigh: gain }));
      }
  };

  const setDelay = (wet: number) => {
      if (delayGainRef.current && dryGainRef.current) {
          const w = Math.max(0, Math.min(1, wet));
          delayGainRef.current.gain.setTargetAtTime(w, engine.context!.currentTime, 0.1);
          setState(prev => ({ ...prev, delayWet: w }));
      }
  };

  const triggerFX = (type: 'stutter' | 'brake' | 'spinUp' | 'filterSweep' | 'glitch') => {
      const audio = audioRef.current;
      const ctx = engine.context;
      if (!audio || !ctx) return;

      switch (type) {
          case 'stutter':
              // Repeat last 1/8th note (approx 250ms)
              const start = audio.currentTime;
              const interval = 0.125; 
              let count = 0;
              const stutterId = setInterval(() => {
                  audio.currentTime = start;
                  count++;
                  if (count > 8) clearInterval(stutterId);
              }, interval * 1000);
              break;
          
          case 'brake':
              // Tape Stop effect
              // We can't smoothly ramp playbackRate on HTMLAudioElement easily without artifacts,
              // but we can try.
              const originalRate = audio.playbackRate;
              let rate = originalRate;
              const brakeId = setInterval(() => {
                  rate -= 0.1;
                  if (rate <= 0) {
                      audio.pause();
                      audio.playbackRate = originalRate;
                      clearInterval(brakeId);
                  } else {
                      audio.playbackRate = rate;
                  }
              }, 50);
              break;

          case 'spinUp':
               audio.playbackRate = 0.1;
               audio.play();
               let upRate = 0.1;
               const spinId = setInterval(() => {
                   upRate += 0.1;
                   if (upRate >= 1.0) {
                       audio.playbackRate = 1.0;
                       clearInterval(spinId);
                   } else {
                       audio.playbackRate = upRate;
                   }
               }, 50);
               break;

          case 'filterSweep':
              if (filterNodeRef.current) {
                  const now = ctx.currentTime;
                  filterNodeRef.current.frequency.cancelScheduledValues(now);
                  filterNodeRef.current.frequency.setValueAtTime(200, now);
                  filterNodeRef.current.frequency.exponentialRampToValueAtTime(20000, now + 2); // 2 second sweep
                  setState(prev => ({ ...prev, filterFreq: 20000 }));
              }
              break;

          case 'glitch':
              // Randomly jump around current position
              const glitchStart = audio.currentTime;
              let glitchCount = 0;
              const glitchId = setInterval(() => {
                  const offset = (Math.random() - 0.5) * 0.5; // +/- 250ms
                  audio.currentTime = Math.max(0, glitchStart + offset);
                  glitchCount++;
                  if (glitchCount > 10) {
                      clearInterval(glitchId);
                      audio.currentTime = glitchStart + 1; // Return to approx correct time
                  }
              }, 100);
              break;
      }
  };

  return {
    state,
    loadTrack,
    play,
    pause,
    setVolume,
    seek,
    setFilter,
    setEQ,
    setDelay,
    triggerFX,
    setPlaybackRate,
    toggleLoop
  };
}
