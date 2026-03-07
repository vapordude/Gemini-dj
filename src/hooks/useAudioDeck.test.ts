import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAudioDeck, Track } from './useAudioDeck';
import { AudioEngine } from '../lib/AudioEngine';

// Mock Audio Engine
vi.mock('../lib/AudioEngine', () => {
  return {
    AudioEngine: {
      getInstance: vi.fn(() => ({
        init: vi.fn(),
        resume: vi.fn(),
        context: {
          currentTime: 0,
          createMediaElementSource: vi.fn(() => {
            const node: any = { connect: vi.fn(() => node) };
            return node;
          }),
          createGain: vi.fn(() => {
            const node: any = {
              gain: { value: 1, setTargetAtTime: vi.fn() },
              connect: vi.fn(() => node),
            };
            return node;
          }),
          createBiquadFilter: vi.fn(() => {
            const node: any = {
              type: '',
              frequency: { value: 0, setTargetAtTime: vi.fn(), cancelScheduledValues: vi.fn(), setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
              Q: { value: 0, setTargetAtTime: vi.fn() },
              gain: { value: 0, setTargetAtTime: vi.fn() },
              connect: vi.fn(() => node),
            };
            return node;
          }),
          createDelay: vi.fn(() => {
            const node: any = {
              delayTime: { value: 0 },
              connect: vi.fn(() => node),
            };
            return node;
          }),
        },
        masterGain: {},
      }))
    }
  };
});

describe('useAudioDeck', () => {
  let mockFetch: any;
  let mockAudio: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockFetch = vi.fn();
    window.fetch = mockFetch;

    // Mock HTMLAudioElement
    mockAudio = {
      src: '',
      load: vi.fn(),
      play: vi.fn(() => Promise.resolve()),
      pause: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      crossOrigin: '',
    };

    // We need to overwrite the Audio constructor in the environment to return our mock
    vi.spyOn(window, 'Audio').mockImplementation(function() { return mockAudio as any });
  });

  const mockTrackWithoutBpm: Track = {
    id: 'track-1',
    title: 'Test Song',
    artist: 'Test Artist',
    thumbnail: 'thumb.jpg',
    duration: 180,
  };

  const mockTrackWithBpm: Track = {
    ...mockTrackWithoutBpm,
    bpm: 120,
    key: 'C min',
  };

  it('should initialize successfully', () => {
    const { result } = renderHook(() => useAudioDeck());
    expect(result.current.state.volume).toBe(1.0);
    expect(result.current.state.isPlaying).toBe(false);
  });

  it('should load track directly when it has bpm and analysis', async () => {
    const { result } = renderHook(() => useAudioDeck());

    await act(async () => {
      await result.current.loadTrack(mockTrackWithBpm);
    });

    // Fetch should not be called since bpm exists
    expect(mockFetch).not.toHaveBeenCalled();

    // Audio src should be set correctly
    expect(mockAudio.src).toContain('/api/stream/track-1');
    expect(mockAudio.load).toHaveBeenCalled();

    // State should be updated with the track
    expect(result.current.state.track).toEqual(mockTrackWithBpm);
    expect(result.current.state.isPlaying).toBe(false);
    expect(result.current.state.currentTime).toBe(0);
  });

  it('should fetch analysis when track does not have bpm', async () => {
    const analysisResponse = {
      bpm: 128,
      key: 'G maj',
      energy: 'High',
    };

    mockFetch.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce(analysisResponse),
    });

    const { result } = renderHook(() => useAudioDeck());

    await act(async () => {
      await result.current.loadTrack(mockTrackWithoutBpm);
    });

    // Fetch should be called for analysis
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith('/api/analyze-track', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ title: 'Test Song', artist: 'Test Artist' })
    }));

    // Audio src should be set correctly
    expect(mockAudio.src).toContain('/api/stream/track-1');
    expect(mockAudio.load).toHaveBeenCalled();

    // State should be updated with track + analysis
    expect(result.current.state.track).toEqual({
      ...mockTrackWithoutBpm,
      ...analysisResponse,
    });
  });

  it('should fallback gracefully if analysis fetch fails', async () => {
    // Make fetch throw an error
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useAudioDeck());

    await act(async () => {
      await result.current.loadTrack(mockTrackWithoutBpm);
    });

    expect(consoleSpy).toHaveBeenCalledWith("Analysis failed", expect.any(Error));

    // Audio should still be loaded
    expect(mockAudio.src).toContain('/api/stream/track-1');
    expect(mockAudio.load).toHaveBeenCalled();

    // State should still have the original unanalyzed track
    expect(result.current.state.track).toEqual(mockTrackWithoutBpm);

    consoleSpy.mockRestore();
  });
});
