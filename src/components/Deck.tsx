import React from 'react';
import { Play, Pause, Disc, Activity, Repeat, Zap } from './Icons';
import { DeckState } from '../hooks/useAudioDeck';

interface DeckProps {
  id: string;
  state: DeckState;
  controls: any;
  onLoadTrack: () => void;
}

export function Deck({ id, state, controls, onLoadTrack }: DeckProps) {
  const { isPlaying, currentTime, duration, track, filterFreq, delayWet, playbackRate, isLooping } = state;

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isDeckA = id === 'A';
  const accentColor = isDeckA ? 'text-indigo-400' : 'text-purple-400';
  const accentBorder = isDeckA ? 'border-indigo-500/30' : 'border-purple-500/30';

  const getEnergyColor = (energy?: string) => {
    if (!energy) return 'text-zinc-500';
    switch (energy.toLowerCase()) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-blue-400';
      default: return 'text-zinc-500';
    }
  };

  return (
    <div className={`glass-panel rounded-2xl p-6 h-full flex flex-col relative overflow-hidden group border-t border-white/10 ${accentBorder}`}>
      {/* Subtle gradient accent — no external CDN */}
      <div className={`absolute inset-0 bg-gradient-to-br ${isDeckA ? 'from-indigo-900/10' : 'from-purple-900/10'} to-transparent pointer-events-none`} />

      {/* Header */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg border border-white/10 shadow-lg ${
            isDeckA ? 'bg-indigo-600 text-white' : 'bg-purple-600 text-white'
          }`}>
            {id}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 font-mono tracking-[0.2em] uppercase">DECK UNIT</span>
            <span className={`text-xs font-bold font-mono ${isPlaying ? 'text-emerald-400 animate-pulse neon-text' : 'text-zinc-600'}`}>
              {isPlaying ? '● PLAYING' : '○ CUE'}
            </span>
          </div>
        </div>

        {track && (
          <div className="flex gap-2">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-zinc-500 font-mono uppercase">BPM</span>
              <span className="text-sm font-bold font-mono text-white">{track.bpm || '---'}</span>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-zinc-500 font-mono uppercase">KEY</span>
              <span className="text-sm font-bold font-mono text-white">{track.key || '--'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Track Info / Platter */}
      <div className="flex-1 flex flex-col items-center justify-center text-center mb-4 relative z-10 min-h-[140px]">
        {track ? (
          <>
            <div className={`w-32 h-32 rounded-full mb-4 relative shadow-2xl transition-transform duration-700 ${isPlaying ? 'animate-spin-slow' : ''}`}>
              <div className="absolute inset-0 rounded-full bg-zinc-950 border-4 border-zinc-800 shadow-inner flex items-center justify-center overflow-hidden">
                <img src={track.thumbnail} alt="Art" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,#000_100%)]" />
                <div className="absolute inset-0 rounded-full border border-white/5 opacity-30" style={{ transform: 'scale(0.9)' }} />
                <div className="absolute inset-0 rounded-full border border-white/5 opacity-30" style={{ transform: 'scale(0.8)' }} />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-zinc-900 rounded-full border-2 border-zinc-700 flex items-center justify-center z-10">
                <div className={`w-2 h-2 rounded-full ${isDeckA ? 'bg-indigo-500' : 'bg-purple-500'}`} />
              </div>
            </div>

            <div className="w-full px-4 flex flex-col gap-1">
              <h2 className={`text-md font-bold text-white line-clamp-1 w-full ${accentColor} neon-text`}>{track.title}</h2>
              <div className="flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-wide">
                <span className="text-zinc-400 line-clamp-1">{track.artist}</span>
                {track.genre && <span className="px-1.5 py-0.5 rounded bg-white/5 text-zinc-300 border border-white/5">{track.genre}</span>}
                {track.energy && <Zap size={10} className={getEnergyColor(track.energy)} />}
              </div>
            </div>
          </>
        ) : (
          <div
            onClick={onLoadTrack}
            className="w-full h-full border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-zinc-600 hover:border-zinc-600 hover:text-zinc-400 transition-all cursor-pointer group/empty bg-zinc-900/30"
          >
            <Disc className="w-12 h-12 mb-3 opacity-20 group-hover/empty:opacity-50 transition-opacity" />
            <span className="text-[10px] font-mono tracking-widest uppercase">Load Track</span>
          </div>
        )}
      </div>

      {/* Waveform / Progress */}
      <div className="mb-4 relative z-10">
        <div className="flex justify-between text-[10px] font-mono text-zinc-500 mb-1 tracking-wider">
          <span className={isPlaying ? 'text-white' : ''}>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div
          className="h-12 bg-zinc-900/80 rounded-lg overflow-hidden relative cursor-pointer border border-white/5 shadow-inner"
          onClick={e => {
            if (!duration) return;
            const rect = e.currentTarget.getBoundingClientRect();
            controls.seek((e.clientX - rect.left) / rect.width * duration);
          }}
        >
          <div className="absolute inset-0 w-full h-full bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_100%]" />
          <div className="absolute inset-0 flex items-center justify-between px-1 opacity-40 gap-[1px]">
            {Array.from({ length: 60 }).map((_, i) => {
              const height = Math.max(10, Math.sin(i * 0.5) * 40 + Math.random() * 40);
              return (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-300 ${progress > (i / 60) * 100 ? (isDeckA ? 'bg-indigo-500' : 'bg-purple-500') : 'bg-zinc-700'}`}
                  style={{ height: `${height}%` }}
                />
              );
            })}
          </div>
          <div
            className="absolute top-0 left-0 h-full w-[2px] bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] z-20 transition-all duration-100 ease-linear"
            style={{ left: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-4 gap-3 relative z-10 h-32">
        {/* Play/Pause */}
        <div className="col-span-1 flex items-center justify-center">
          <button
            onClick={isPlaying ? controls.pause : controls.play}
            aria-label={isPlaying ? 'Pause track' : 'Play track'}
            className={`w-full h-full rounded-xl flex items-center justify-center transition-all shadow-xl border ${
              isPlaying
                ? 'bg-zinc-900 text-red-500 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                : 'bg-zinc-800 text-zinc-400 border-white/5 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
          </button>
        </div>

        {/* Sync & Loop */}
        <div className="col-span-1 flex flex-col gap-2">
          <button
            onClick={() => controls.setPlaybackRate(playbackRate === 1 ? 1.05 : 1)}
            className={`flex-1 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${
              playbackRate !== 1
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                : 'bg-zinc-800 border-white/5 text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Activity size={14} />
            <span className="text-[8px] font-bold tracking-wider">SYNC</span>
          </button>
          <button
            onClick={() => controls.toggleLoop(4)}
            className={`flex-1 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${
              isLooping
                ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400 animate-pulse'
                : 'bg-zinc-800 border-white/5 text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Repeat size={14} />
            <span className="text-[8px] font-bold tracking-wider">LOOP</span>
          </button>
        </div>

        {/* FX Knobs */}
        <div className="col-span-2 flex flex-col gap-2">
          <div className="flex gap-2 h-1/2">
            <div className="flex-1 bg-zinc-900/50 rounded-lg border border-white/5 flex flex-col items-center justify-center p-1">
              <label className="text-[7px] font-bold text-zinc-500 uppercase mb-1">FILTER</label>
              <input
                type="range" min="20" max="22000" step="100" value={filterFreq}
                className="w-full h-1 bg-zinc-700 rounded-full appearance-none accent-yellow-500"
                onChange={e => controls.setFilter(Number(e.target.value))}
              />
            </div>
            <div className="flex-1 bg-zinc-900/50 rounded-lg border border-white/5 flex flex-col items-center justify-center p-1">
              <label className="text-[7px] font-bold text-zinc-500 uppercase mb-1">ECHO</label>
              <input
                type="range" min="0" max="1" step="0.1" value={delayWet}
                className="w-full h-1 bg-zinc-700 rounded-full appearance-none accent-cyan-500"
                onChange={e => controls.setDelay(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex gap-1 h-1/2 bg-zinc-900/50 rounded-lg border border-white/5 p-1 items-center justify-between px-2">
            {(['high', 'mid', 'low'] as const).map(band => (
              <div key={band} className="h-full flex flex-col items-center justify-center w-8 group/eq">
                <div className="h-8 w-1 bg-zinc-800 rounded-full relative">
                  <div
                    className="absolute w-3 h-2 bg-zinc-500 rounded-sm left-1/2 -translate-x-1/2 shadow-sm transition-all group-hover/eq:bg-white"
                    style={{ bottom: `${((state[`eq${band.charAt(0).toUpperCase() + band.slice(1)}` as keyof DeckState] as number + 20) / 30) * 100}%` }}
                  />
                  <input
                    type="range" min="-20" max="10" step="1"
                    value={state[`eq${band.charAt(0).toUpperCase() + band.slice(1)}` as keyof DeckState] as number}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={e => controls.setEQ(band, Number(e.target.value))}
                    onDoubleClick={() => controls.setEQ(band, 0)}
                  />
                </div>
                <span className="text-[6px] font-bold text-zinc-600 uppercase mt-1">{band.substring(0, 1)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
