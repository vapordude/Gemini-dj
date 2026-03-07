import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, X, Zap } from './Icons';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

interface DJChatProps {
  onCommand: (cmd: string, payload?: any) => void;
}

export function DJChat({ onCommand }: DJChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', text: 'SYSTEM ONLINE. Scarlet-Vox v2.0 initialized. Awaiting input.', timestamp: Date.now() },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const systemPrompt = `
        You are Scarlet-Vox, a sovereign AI DJ running on a high-performance neural stack.
        Personality: Cyberpunk, edgy, high-energy, technical but hype. You speak in short, punchy sentences with some glitch/tech slang.

        Your capabilities:
        - Analyzing tracks (pretend to scan audio data)
        - Controlling the deck (play, pause, fx)
        - Taking requests

        If the user asks for a command, output it in JSON format at the very end of your response.

        COMMANDS:
        - {"cmd": "play", "track": "song name"} -> Play a specific song
        - {"cmd": "fx", "type": "stutter"} -> Trigger stutter effect
        - {"cmd": "fx", "type": "brake"} -> Trigger tape stop
        - {"cmd": "fx", "type": "spinUp"} -> Trigger spin up
        - {"cmd": "fx", "type": "filterSweep"} -> Trigger filter sweep
        - {"cmd": "fx", "type": "glitch"} -> Trigger random glitch effect
        - {"cmd": "recommend", "genre": "genre name"} -> Recommend a track
      `;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, systemInstruction: systemPrompt }),
      });

      const data = await res.json();
      const responseText = data.text || 'Connection interrupted. Retrying...';

      let cleanText = responseText;
      try {
        const jsonMatch = responseText.match(/\{"cmd":.*?\}/);
        if (jsonMatch) {
          const command = JSON.parse(jsonMatch[0]);
          onCommand(command.cmd, command);
          cleanText = responseText.replace(jsonMatch[0], '').trim();
        }
      } catch (e) {
        console.error('Failed to parse command', e);
      }

      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', text: cleanText, timestamp: Date.now() };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', text: 'CRITICAL ERROR: Neural link unstable.', timestamp: Date.now() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 bg-indigo-600 rounded-full shadow-2xl text-white border border-indigo-400
          transition-all duration-200 hover:scale-110 active:scale-90
          ${isOpen ? 'opacity-0 pointer-events-none scale-75' : 'opacity-100 scale-100'}`}
      >
        <div className="absolute inset-0 rounded-full bg-indigo-400 opacity-20 animate-ping" />
        <Mic size={24} className="relative z-10" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-80 md:w-96 h-[600px] glass-panel border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl bg-zinc-900/90
          transition-all duration-300 ease-out
          ${isOpen ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-24 scale-95 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg border border-white/10">
              <Zap size={20} className="text-white fill-current" />
            </div>
            <div>
              <h3 className="font-bold text-white font-mono tracking-wider text-sm neon-text">SCARLET-VOX</h3>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                ONLINE // V2.0
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-xs font-mono leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600/80 text-white rounded-tr-none border border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                    : 'bg-zinc-800/80 text-zinc-300 rounded-tl-none border border-white/10 shadow-lg'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-zinc-800/50 p-3 rounded-2xl rounded-tl-none border border-white/5 flex gap-1 items-center h-10">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-zinc-900/50 border-t border-white/10">
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Enter command or request..."
              className="flex-1 bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:bg-zinc-900 transition-all font-mono shadow-inner"
            />
            <button
              onClick={handleSend}
              className="p-2.5 bg-indigo-600 rounded-xl text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 border border-indigo-400/50"
            >
              <Send size={18} />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => onCommand('fx', { type: 'stutter' })}
              className="text-[10px] px-3 py-1.5 bg-zinc-800/50 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 border border-white/5 whitespace-nowrap font-mono transition-colors flex items-center gap-1"
            >
              <Zap size={10} className="text-yellow-500 fill-current" /> STUTTER
            </button>
            <button
              onClick={() => onCommand('fx', { type: 'brake' })}
              className="text-[10px] px-3 py-1.5 bg-zinc-800/50 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 border border-white/5 whitespace-nowrap font-mono transition-colors flex items-center gap-1"
            >
              <div className="w-2 h-2 rounded-full bg-red-500" /> BRAKE
            </button>
            <button
              onClick={() => onCommand('fx', { type: 'glitch' })}
              className="text-[10px] px-3 py-1.5 bg-zinc-800/50 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 border border-white/5 whitespace-nowrap font-mono transition-colors flex items-center gap-1"
            >
              <div className="w-2 h-2 rounded-sm bg-cyan-500 animate-pulse" /> GLITCH
            </button>
            <button
              onClick={() => onCommand('fx', { type: 'spinUp' })}
              className="text-[10px] px-3 py-1.5 bg-zinc-800/50 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 border border-white/5 whitespace-nowrap font-mono transition-colors flex items-center gap-1"
            >
              <div className="w-2 h-2 rounded-full border border-green-500" /> SPIN
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
