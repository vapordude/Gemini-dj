import React, { useState, useEffect } from 'react';
import { Deck } from './components/Deck';
import { Mixer } from './components/Mixer';
import { Library } from './components/Library';
import { Visualizer } from './components/Visualizer';
import { useAudioDeck, Track } from './hooks/useAudioDeck';
import { useAutoDJ } from './hooks/useAutoDJ';
import { Mic, Sparkles, Zap } from './components/Icons';
import { DJChat } from './components/DJChat';

export default function App() {
  const [crossfader, setCrossfader] = useState(0.5);
  const [queue, setQueue] = useState<Track[]>([]);

  const deckA = useAudioDeck(1.0);
  const deckB = useAudioDeck(0.0);

  const { autoDJ, setAutoDJ, djSpeaking, generating, triggerManualTransition } = useAutoDJ({
    deckA,
    deckB,
    crossfader,
    setCrossfader,
    queue,
    setQueue,
  });

  // Equal-power crossfader
  useEffect(() => {
    const volA = Math.cos(crossfader * 0.5 * Math.PI);
    const volB = Math.cos((1 - crossfader) * 0.5 * Math.PI);
    deckA.setVolume(volA);
    deckB.setVolume(volB);
  }, [crossfader]);

  const handleQueueTracks = (tracks: Track[]) => {
    setQueue(prev => [...prev, ...tracks]);
    if (!deckA.state.isPlaying && !deckB.state.isPlaying && autoDJ && tracks.length > 0) {
      deckA.loadTrack(tracks[0]);
      deckA.play();
      setQueue(prev => prev.slice(1));
      setCrossfader(0);
    }
  };

  const handleDJCommand = async (cmd: string, payload: any) => {
    if (cmd === 'play' && payload.track) {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(payload.track)}`);
        const data = await res.json();
        if (data.tracks?.length > 0) {
          const track = data.tracks[0];
          if (!deckA.state.isPlaying && !deckA.state.track) {
            deckA.loadTrack(track); deckA.play();
          } else if (!deckB.state.isPlaying && !deckB.state.track) {
            deckB.loadTrack(track); deckB.play();
          } else {
            handleQueueTracks([track]);
          }
        }
      } catch (e) {
        console.error('Failed to auto-play track', e);
      }
    } else if (cmd === 'fx') {
      const activeDeck = crossfader < 0.5 ? deckA : deckB;
      if (activeDeck.triggerFX) activeDeck.triggerFX(payload.type);
    }
  };

  return (
    <div className="h-screen w-screen bg-zinc-950 text-white font-sans overflow-hidden flex flex-col selection:bg-indigo-500/30">
      {/* Header */}
      <header className="h-14 border-b border-white/5 flex items-center px-6 justify-between bg-zinc-900/80 backdrop-blur-md z-50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 animate-pulse-slow">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <h1 className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 neon-text">
            SCARLET-VOX <span className="text-xs font-mono text-indigo-400 ml-2">v2.0 SOVEREIGN</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setAutoDJ(!autoDJ)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-medium text-xs transition-all border ${
              autoDJ
                ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                : 'bg-zinc-800 border-white/10 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            <Zap size={14} className={autoDJ ? 'fill-current text-indigo-300' : ''} />
            <span>AUTO DJ {autoDJ ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={triggerManualTransition}
            disabled={generating || !deckA.state.track || !deckB.state.track}
            title={
              generating
                ? "Generating transition..."
                : (!deckA.state.track || !deckB.state.track)
                  ? "Load tracks on both decks to transition"
                  : "Trigger transition"
            }
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-medium text-xs transition-all ${
              generating
                ? 'bg-zinc-800 text-zinc-500 disabled:cursor-wait'
                : 'bg-white text-black hover:bg-zinc-200 shadow-lg shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white'
            }`}
          >
            {generating ? (
              <span className="animate-pulse">GENERATING...</span>
            ) : (
              <>
                <Mic size={14} />
                <span>TRANSITION</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 p-4 grid grid-cols-12 gap-4 min-h-0 relative">
        {/* Decks & Mixer Area */}
        <div className="col-span-12 lg:col-span-9 flex flex-col gap-4 h-full">
          {/* Visualizer Panel */}
          <div className="h-48 glass-panel rounded-2xl overflow-hidden relative shrink-0">
            <Visualizer />
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none p-4 flex justify-between items-start">
              {autoDJ && (
                <div className="flex flex-col gap-1 bg-black/50 backdrop-blur-sm p-2 rounded-lg border border-white/5">
                  <div className="text-[10px] font-bold text-indigo-400 tracking-wider font-mono">UP NEXT ({queue.length})</div>
                  {queue.slice(0, 2).map((t, i) => (
                    <div key={i} className="text-xs text-zinc-300 truncate max-w-[200px] font-mono">{i + 1}. {t.title}</div>
                  ))}
                </div>
              )}
              {djSpeaking && (
                <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-bold rounded-full animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                  ON AIR
                </div>
              )}
            </div>
          </div>

          {/* Decks Row */}
          <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
            <div className="col-span-5 h-full relative">
              <Deck id="A" state={deckA.state} controls={deckA} onLoadTrack={() => {}} />
            </div>
            <div className="col-span-2 h-full relative z-10">
              <Mixer crossfader={crossfader} onCrossfaderChange={setCrossfader} />
            </div>
            <div className="col-span-5 h-full relative">
              <Deck id="B" state={deckB.state} controls={deckB} onLoadTrack={() => {}} />
            </div>
          </div>
        </div>

        {/* Sidebar / Library */}
        <div className="col-span-12 lg:col-span-3 h-full min-h-0 glass-panel rounded-2xl overflow-hidden flex flex-col">
          <Library
            onLoadTrack={track => {
              if (!deckA.state.track) deckA.loadTrack(track);
              else if (!deckB.state.track) deckB.loadTrack(track);
              else if (crossfader > 0.5) deckA.loadTrack(track);
              else deckB.loadTrack(track);
            }}
            onQueueTracks={handleQueueTracks}
          />
        </div>
      </main>

      <DJChat onCommand={handleDJCommand} />
    </div>
  );
}
