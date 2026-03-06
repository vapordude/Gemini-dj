import React, { useEffect, useRef } from 'react';
import { AudioEngine } from '../lib/AudioEngine';

export function Visualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engine = AudioEngine.getInstance();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const analyser = engine.analyser;
    const bufferLength = analyser ? analyser.frequencyBinCount : 1024;
    const dataArray = new Uint8Array(bufferLength);

    // Peak hold state
    const peaks = new Float32Array(bufferLength).fill(0);

    const draw = () => {
      animationId = requestAnimationFrame(draw);

      // Clear with trail effect
      ctx.fillStyle = 'rgba(9, 9, 11, 0.2)'; // zinc-950 with opacity for trails
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      // Vertical lines
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      // Horizontal lines
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();

      if (!engine.analyser) {
          // Idle animation: Scanline
          const time = Date.now() / 1000;
          const y = (Math.sin(time) * 0.5 + 0.5) * canvas.height;
          ctx.strokeStyle = 'rgba(99, 102, 241, 0.5)'; // Indigo
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
          return;
      }

      engine.analyser.getByteFrequencyData(dataArray);

      // Beat Detection (Simple Low Freq Energy)
      let bassEnergy = 0;
      for (let i = 0; i < 10; i++) {
          bassEnergy += dataArray[i];
      }
      bassEnergy /= 10;
      const isKick = bassEnergy > 240;

      // Background Pulse on Kick
      if (isKick) {
          ctx.fillStyle = 'rgba(79, 70, 229, 0.1)'; // Indigo pulse
          ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw Spectrum (Mirrored)
      const centerX = canvas.width / 2;
      
      // We only draw the first ~1/3 of bins (most musical content is < 5kHz)
      // But let's map it logarithmically for better view
      const drawCount = 64; // Number of bars per side
      const barWidth = (canvas.width / 2) / drawCount;
      
      // Logarithmic mapping helper
      const getLogIndex = (i: number, min: number, max: number) => {
        const logMin = Math.log(min);
        const logMax = Math.log(max);
        const scale = (logMax - logMin) / drawCount;
        return Math.exp(logMin + scale * i);
      }

      for (let i = 0; i < drawCount; i++) {
        // Map bar index to frequency bin index logarithmically
        // Start from bin 1 (ignore DC) to ~half buffer (Nyquist)
        const binIndex = Math.floor(getLogIndex(i, 1, bufferLength / 2));
        const value = dataArray[binIndex] || 0;
        const percent = value / 255;
        const height = percent * canvas.height * 0.8; // Leave some headroom

        // Peak decay
        peaks[i] = Math.max(peaks[i] - 2, height);

        // Color Gradient
        // Bass (center) -> Purple -> Cyan (edges)
        const hue = 260 - (i / drawCount) * 80; // 260 (Purple) -> 180 (Cyan)
        ctx.fillStyle = `hsla(${hue}, 100%, 60%, 0.8)`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsla(${hue}, 100%, 60%, 0.5)`;
        
        // Mirrored Bars
        // Right Side
        const xRight = centerX + (i * barWidth);
        ctx.fillRect(xRight, canvas.height / 2 - height / 2, barWidth - 2, height);
        
        // Left Side
        const xLeft = centerX - ((i + 1) * barWidth);
        ctx.fillRect(xLeft, canvas.height / 2 - height / 2, barWidth - 2, height);

        // Reset shadow
        ctx.shadowBlur = 0;

        // Draw Peaks
        ctx.fillStyle = '#ffffff';
        // Right Peak
        ctx.fillRect(xRight, canvas.height / 2 - peaks[i] / 2 - 2, barWidth - 2, 2);
        ctx.fillRect(xRight, canvas.height / 2 + peaks[i] / 2, barWidth - 2, 2);
        
        // Left Peak
        ctx.fillRect(xLeft, canvas.height / 2 - peaks[i] / 2 - 2, barWidth - 2, 2);
        ctx.fillRect(xLeft, canvas.height / 2 + peaks[i] / 2, barWidth - 2, 2);
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      width={1200} 
      height={300} 
      className="w-full h-full object-cover rounded-xl opacity-80 mix-blend-screen"
    />
  );
}
