import React, { useState, useEffect } from 'react';
import { Search, Plus, Music, List, User, Disc, ChevronLeft, PlayCircle } from './Icons';
import { Track } from '../hooks/useAudioDeck';

interface LibraryProps {
  onLoadTrack: (track: Track) => void;
  onQueueTracks: (tracks: Track[]) => void;
}

type Tab = 'search' | 'playlists' | 'songs' | 'artists';

export function Library({ onLoadTrack, onQueueTracks }: LibraryProps) {
  const [activeTab, setActiveTab] = useState<Tab>('search');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [songs, setSongs] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [playlistTracks, setPlaylistTracks] = useState<Track[]>([]);
  const [authMessage, setAuthMessage] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.tracks) setResults(data.tracks);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLibrary = async (type: 'playlists' | 'songs' | 'artists') => {
    setLoading(true);
    setAuthMessage(null);
    try {
      const res = await fetch(`/api/library/${type}`);
      const data = await res.json();

      if (data.message) setAuthMessage(data.message);
      if (type === 'playlists') setPlaylists(data.playlists || []);
      if (type === 'songs') setSongs(data.songs || []);
      if (type === 'artists') setArtists(data.artists || []);
    } catch (err) {
      console.error(`Failed to fetch ${type}`, err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaylistTracks = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/playlist/${id}`);
      const data = await res.json();
      if (data.tracks) {
        setPlaylistTracks(data.tracks);
        setSelectedPlaylist(id);
      }
    } catch (err) {
      console.error('Failed to fetch playlist tracks', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab !== 'search') fetchLibrary(activeTab);
  }, [activeTab]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    if (authMessage) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-zinc-500 text-center px-4">
          <p className="mb-2 text-yellow-500 font-mono text-xs uppercase tracking-wider">Authentication Required</p>
          <p className="text-[10px] text-zinc-400">Set YTMUSIC_COOKIE in .env to access your library.</p>
        </div>
      );
    }

    if (selectedPlaylist) {
      return (
        <div className="space-y-1">
          <div className="flex items-center justify-between mb-4 px-2">
            <button
              onClick={() => setSelectedPlaylist(null)}
              className="flex items-center gap-2 text-[10px] text-zinc-400 hover:text-white uppercase tracking-wider font-bold"
            >
              <ChevronLeft size={12} /> Back
            </button>
            <button
              onClick={() => onQueueTracks(playlistTracks)}
              className="flex items-center gap-2 px-3 py-1 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-[10px] font-bold rounded-full transition-colors border border-indigo-500/30"
            >
              <PlayCircle size={12} /> PLAY ALL
            </button>
          </div>
          {playlistTracks.map(track => (
            <TrackItem key={track.id} track={track} onLoadTrack={onLoadTrack} />
          ))}
        </div>
      );
    }

    switch (activeTab) {
      case 'search':
        return results.length > 0 ? (
          <>
            <div className="flex justify-end mb-2 px-2">
              <button
                onClick={() => onQueueTracks(results)}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wider"
              >
                QUEUE ALL
              </button>
            </div>
            {results.map(track => (
              <TrackItem key={track.id} track={track} onLoadTrack={onLoadTrack} />
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-600">
            <Music className="w-8 h-8 mb-2 opacity-20" />
            <p className="text-xs font-mono">SEARCH TRACKS</p>
          </div>
        );

      case 'playlists':
        return playlists.length > 0 ? (
          playlists.map((playlist: any) => (
            <div
              key={playlist.playlistId}
              className="group flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5"
              onClick={() => fetchPlaylistTracks(playlist.playlistId)}
            >
              <div className="w-10 h-10 rounded bg-zinc-800 overflow-hidden shadow-lg">
                <img src={playlist.thumbnails?.[0]?.url} alt={playlist.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-zinc-300 group-hover:text-white truncate">{playlist.name}</h4>
                <p className="text-[10px] text-zinc-500 truncate font-mono">{playlist.count || 0} TRACKS</p>
              </div>
            </div>
          ))
        ) : (
          <EmptyState icon={List} label="NO PLAYLISTS" />
        );

      case 'songs':
        return songs.length > 0 ? (
          <>
            <div className="flex justify-end mb-2 px-2">
              <button
                onClick={() => {
                  const tracks = songs.map((s: any) => ({
                    id: s.videoId,
                    title: s.name,
                    artist: s.artist?.name || 'Unknown',
                    thumbnail: s.thumbnails?.[0]?.url,
                    duration: s.duration || 0,
                  }));
                  onQueueTracks(tracks);
                }}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wider"
              >
                QUEUE ALL
              </button>
            </div>
            {songs.map((song: any) => (
              <TrackItem
                key={song.videoId}
                track={{
                  id: song.videoId,
                  title: song.name,
                  artist: song.artist?.name || 'Unknown',
                  thumbnail: song.thumbnails?.[0]?.url,
                  duration: song.duration || 0,
                }}
                onLoadTrack={onLoadTrack}
              />
            ))}
          </>
        ) : (
          <EmptyState icon={Disc} label="NO SONGS" />
        );

      case 'artists':
        return artists.length > 0 ? (
          artists.map((artist: any) => (
            <div key={artist.artistId} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5 group">
              <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden shadow-lg border border-white/5">
                <img src={artist.thumbnails?.[0]?.url} alt={artist.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-zinc-300 group-hover:text-white truncate">{artist.name}</h4>
              </div>
            </div>
          ))
        ) : (
          <EmptyState icon={User} label="NO ARTISTS" />
        );
    }
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* Tabs */}
      <div className="flex border-b border-white/5 bg-zinc-900/30">
        <TabButton active={activeTab === 'search'} onClick={() => setActiveTab('search')} icon={Search} ariaLabel="Search" />
        <TabButton active={activeTab === 'playlists'} onClick={() => setActiveTab('playlists')} icon={List} ariaLabel="Playlists" />
        <TabButton active={activeTab === 'songs'} onClick={() => setActiveTab('songs')} icon={Disc} ariaLabel="Songs" />
        <TabButton active={activeTab === 'artists'} onClick={() => setActiveTab('artists')} icon={User} ariaLabel="Artists" />
      </div>

      {activeTab === 'search' && (
        <div className="p-3 border-b border-white/5 bg-zinc-900/30">
          <form onSubmit={handleSearch} className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-3 h-3 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="SEARCH DATABASE..."
              className="w-full bg-zinc-950/50 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:bg-zinc-900 transition-all font-mono"
            />
          </form>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
        {renderContent()}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, ariaLabel }: { active: boolean; onClick: () => void; icon: any; ariaLabel: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`flex-1 py-3 flex justify-center items-center transition-all border-b-2 relative overflow-hidden ${
        active ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' : 'border-transparent text-zinc-600 hover:text-zinc-400 hover:bg-white/5'
      }`}
    >
      <Icon size={16} />
      {active && <div className="absolute inset-0 bg-indigo-500/10 animate-pulse" />}
    </button>
  );
}

interface TrackItemProps {
  track: Track;
  onLoadTrack: (t: Track) => void;
}

const TrackItem: React.FC<TrackItemProps> = ({ track, onLoadTrack }) => (
  <div
    className="group flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5"
    onClick={() => onLoadTrack(track)}
  >
    <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-zinc-800 shadow-md">
      <img src={track.thumbnail} alt={track.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
        <Plus className="text-white w-4 h-4" />
      </div>
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-xs font-bold text-zinc-300 group-hover:text-white truncate transition-colors">{track.title}</h4>
      <p className="text-[10px] text-zinc-500 truncate font-mono uppercase tracking-wide">{track.artist}</p>
    </div>
    <div className="text-[10px] font-mono text-zinc-600 group-hover:text-zinc-400">
      {typeof track.duration === 'number'
        ? `${Math.floor(track.duration / 60)}:${Math.floor(track.duration % 60).toString().padStart(2, '0')}`
        : track.duration}
    </div>
  </div>
);

function EmptyState({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-zinc-700">
      <Icon className="w-8 h-8 mb-2 opacity-20" />
      <p className="text-[10px] font-mono uppercase tracking-widest">{label}</p>
    </div>
  );
}
