import React, { useState, useEffect, useRef } from 'react';
import { Track } from './useAudioDeck';

interface AutoDJProps {
  deckA: any;
  deckB: any;
  crossfader: number;
  setCrossfader: (val: number) => void;
  queue: Track[];
  setQueue: React.Dispatch<React.SetStateAction<Track[]>>;
}

export function useAutoDJ({ deckA, deckB, crossfader, setCrossfader, queue, setQueue }: AutoDJProps) {
  const [autoDJ, setAutoDJ] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [djSpeaking, setDjSpeaking] = useState(false);
  const [generating, setGenerating] = useState(false);
  const transitionRef = useRef<boolean>(false);

  const performAutoTransition = async (currentDeck: any, nextDeck: any) => {
    if (transitionRef.current) return;
    transitionRef.current = true;
    setIsTransitioning(true);

    try {
      if (queue.length === 0) {
          console.log("Auto DJ: Queue empty, cannot transition");
          return;
      }
      
      const nextTrack = queue[0];
      setQueue(prev => prev.slice(1));

      console.log("Auto DJ: Loading next track", nextTrack.title);
      nextDeck.loadTrack(nextTrack);

      // Generate DJ Voice
      setGenerating(true);
      let audioUrl = null;
      
      try {
        const scriptRes = await fetch('/api/dj/commentary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            currentTrack: currentDeck.state.track || { title: 'Silence', artist: 'None' },
            nextTrack: nextTrack,
            vibe: 'energetic and smooth'
            })
        });
        const { text } = await scriptRes.json();
        
        const audioRes = await fetch('/api/dj/speech', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        const { audio } = await audioRes.json();
        audioUrl = `data:audio/mp3;base64,${audio}`;
      } catch (e) {
        console.error("DJ Generation failed, skipping voice", e);
      } finally {
        setGenerating(false);
      }

      // Play DJ Voice if available
      if (audioUrl) {
        const djAudio = new Audio(audioUrl);
        setDjSpeaking(true);
        
        const currentVol = currentDeck.state.volume;
        currentDeck.setVolume(currentVol * 0.3);
        
        await djAudio.play();
        
        await new Promise(resolve => {
            djAudio.onended = resolve;
            // Fallback timeout
            setTimeout(resolve, 10000);
        });
        
        setDjSpeaking(false);
        currentDeck.setVolume(currentVol);
      }

      // Start Next Track
      nextDeck.play();

      // Crossfade Animation with Filter Sweep
      const startVal = crossfader;
      const endVal = startVal < 0.5 ? 1 : 0;
      const duration = 8000;
      const startTime = performance.now();

      // Initialize Filters
      nextDeck.setFilter(200, 0); 
      nextDeck.setEQ('low', -20);
      
      await new Promise<void>(resolve => {
        const animate = () => {
            const now = performance.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const newVal = startVal + (endVal - startVal) * progress;
            setCrossfader(newVal);

            // Filter Sweep: Out goes Lowpass down, In goes Highpass up? 
            // Actually let's do Lowpass sweep up for incoming, and Lowpass sweep down for outgoing
            // Outgoing: 22000 -> 200
            // Incoming: 200 -> 22000
            
            const outCutoff = 22000 * Math.pow(0.009, progress); 
            const inCutoff = 200 * Math.pow(110, progress); 
            
            currentDeck.setFilter(outCutoff);
            nextDeck.setFilter(inCutoff);

            // Bass Swap at 50%
            if (progress > 0.4 && progress < 0.6) {
                // Smooth swap over 20% of duration
                const swapProgress = (progress - 0.4) / 0.2;
                // Outgoing Bass: 0 -> -20
                const outBass = 0 - (20 * swapProgress);
                // Incoming Bass: -20 -> 0
                const inBass = -20 + (20 * swapProgress);
                
                currentDeck.setEQ('low', outBass);
                nextDeck.setEQ('low', inBass);
            } else if (progress >= 0.6) {
                currentDeck.setEQ('low', -20);
                nextDeck.setEQ('low', 0);
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                resolve();
            }
        };
        requestAnimationFrame(animate);
      });
      
      // Reset Filters after transition
      currentDeck.setFilter(22000); 
      nextDeck.setFilter(22000);
      currentDeck.setEQ('low', 0);
      nextDeck.setEQ('low', 0);
      
      currentDeck.pause();

    } catch (err) {
      console.error("Auto transition failed", err);
    } finally {
      setIsTransitioning(false);
      transitionRef.current = false;
    }
  };

  // Auto DJ Loop
  useEffect(() => {
    if (!autoDJ || queue.length === 0 || isTransitioning) return;

    const activeDeck = crossfader < 0.5 ? deckA : deckB;
    const inactiveDeck = crossfader < 0.5 ? deckB : deckA;

    // If active deck is playing and nearing end (e.g., 20s left)
    if (activeDeck.state.isPlaying && activeDeck.state.duration > 0) {
      const timeRemaining = activeDeck.state.duration - activeDeck.state.currentTime;
      
      if (timeRemaining < 20 && !transitionRef.current) {
        performAutoTransition(activeDeck, inactiveDeck);
      }
    }
    // If active deck stopped but we have queue, start next
    else if (!activeDeck.state.isPlaying && !transitionRef.current && queue.length > 0) {
        performAutoTransition(activeDeck, inactiveDeck);
    }
  }, [autoDJ, queue, deckA.state.currentTime, deckB.state.currentTime, isTransitioning, crossfader]);

  const triggerManualTransition = () => {
      const activeDeck = crossfader < 0.5 ? deckA : deckB;
      const inactiveDeck = crossfader < 0.5 ? deckB : deckA;
      performAutoTransition(activeDeck, inactiveDeck);
  };

  return {
      autoDJ,
      setAutoDJ,
      isTransitioning,
      djSpeaking,
      generating,
      triggerManualTransition
  };
}
