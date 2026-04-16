import React from 'react';

interface MixerProps {
  crossfader: number;
  onCrossfaderChange: (val: number) => void;
}

export function Mixer({ crossfader, onCrossfaderChange }: MixerProps) {
  return (
    <div className="glass-panel rounded-2xl p-4 border-t border-white/10 shadow-2xl flex flex-col items-center justify-center h-full relative overflow-hidden bg-zinc-900/90">
      {/* Subtle noise texture via CSS — no external CDN */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:4px_4px]" />
      
      <div className="relative z-10 flex flex-col items-center w-full h-full justify-between py-4">
          <div className="flex flex-col items-center gap-1">
             <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />
             <h3 className="text-[10px] font-bold text-zinc-500 tracking-[0.3em] uppercase neon-text">X-FADER</h3>
          </div>
      
          <div className="w-full max-w-[120px] relative h-64 flex items-center justify-center">
            {/* Track Container (Vertical for visual interest in this layout? No, keeping horizontal as per App layout) */}
            {/* Wait, App.tsx has Mixer in a col-span-2, between decks. Vertical slider might make more sense if it was a volume fader, but crossfader is usually horizontal. 
               However, the container is tall and narrow (col-span-2 vs col-span-5 for decks). 
               Let's check App.tsx layout again. 
               It's: Deck A (5) | Mixer (2) | Deck B (5).
               So it's a vertical strip. A horizontal crossfader in a vertical strip is tight.
               But standard DJ mixers have the crossfader at the bottom.
               Let's make it a vertical layout of controls, but the crossfader itself should probably be horizontal at the bottom?
               Or maybe just a big vertical slider that acts as a blend? 
               Actually, standard crossfaders are horizontal. 
               Let's stick to horizontal but rotate it? No, that's confusing.
               Let's make it a horizontal slider that fits in the width, or maybe the Mixer component is just the crossfader?
               In App.tsx it says <Mixer ... />.
               Let's look at the previous Mixer.tsx. It was just a crossfader.
               Given the narrow width, maybe a vertical slider is actually better for "Blend" control?
               Or just a compact horizontal one.
               Let's try a vertical "Blend" slider which is effectively a crossfader. Up = A, Down = B? No, that's weird.
               Let's stick to horizontal, but style it to fit.
            */}
            
            {/* Actually, let's look at the space. col-span-2 is roughly 1/6th of the width. On desktop that's plenty for a horizontal slider. */}
            
            <div className="relative w-full h-12 flex items-center">
                {/* Track Background */}
                <div className="absolute w-full h-3 bg-zinc-950 rounded-full shadow-inner border border-white/5 overflow-hidden">
                    {/* Center Marker */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-zinc-700" />
                    {/* Gradients */}
                    <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-indigo-900/40 to-transparent" />
                    <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-purple-900/40 to-transparent" />
                </div>

                {/* Input Range (Invisible) */}
                <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={crossfader}
                onChange={(e) => onCrossfaderChange(parseFloat(e.target.value))}
                className="absolute w-full h-full opacity-0 cursor-pointer z-30 peer"
                aria-label="Crossfader"
                />

                {/* Physical Fader Cap */}
                <div 
                className="absolute h-10 w-6 bg-gradient-to-b from-zinc-200 to-zinc-400 rounded-sm shadow-[0_4px_10px_rgba(0,0,0,0.5)] border-t border-white/50 z-20 pointer-events-none flex items-center justify-center peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-400 peer-focus-visible:outline-none"
                style={{ 
                    left: `${crossfader * 100}%`,
                    transform: 'translateX(-50%)'
                }}
                >
                    <div className="w-[2px] h-6 bg-zinc-400/50 border-r border-white/50" />
                    <div className="absolute inset-0 bg-black/10 rounded-sm" />
                </div>
            </div>
          </div>

          <div className="flex justify-between w-full px-2 text-[9px] font-mono font-bold text-zinc-600">
            <span className="text-indigo-500">A</span>
            <span>MIX</span>
            <span className="text-purple-500">B</span>
          </div>
      </div>
    </div>
  );
}
