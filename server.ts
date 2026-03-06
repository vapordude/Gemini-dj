import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import ytdl from '@distube/ytdl-core';
import ytSearch from 'yt-search';
import { GoogleGenAI } from '@google/genai';
import { Readable } from 'stream';

import YTMusic from 'ytmusic-api';

const app = express();
const PORT = 3000;

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Initialize YTMusic API
const ytmusic = new YTMusic();
let isYTMusicInitialized = false;

async function initYTMusic() {
  if (process.env.YTMUSIC_COOKIE) {
    try {
      await ytmusic.initialize({ cookies: process.env.YTMUSIC_COOKIE });
      isYTMusicInitialized = true;
      console.log('YTMusic API initialized with user cookie.');
    } catch (error) {
      console.error('Failed to initialize YTMusic API:', error);
    }
  } else {
    try {
      await ytmusic.initialize();
      console.log('YTMusic API initialized in guest mode.');
    } catch (error) {
      console.error('Failed to initialize YTMusic API (guest):', error);
    }
  }
}

initYTMusic();

app.use(express.json());

// API Routes
const apiRouter = express.Router();

// ... (existing routes)

// Library: Playlists
apiRouter.get('/library/playlists', async (req, res) => {
  if (!isYTMusicInitialized) {
    return res.status(503).json({ error: 'YTMusic API not initialized' });
  }
  try {
    if (process.env.YTMUSIC_COOKIE) {
        // Use Home Sections as a proxy for "Library" since specific endpoints aren't exposed
        const home = await ytmusic.getHomeSections();
        // Filter for sections that contain playlists
        const playlists = home.flatMap((section: any) => 
            (section.contents || []).filter((item: any) => item.type === 'PLAYLIST')
        );
        res.json({ playlists });
    } else {
        res.json({ playlists: [], message: "Authentication required for library" });
    }
  } catch (error) {
    console.error('Library Playlists error:', error);
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
});

// Library: Songs (Liked/Library)
apiRouter.get('/library/songs', async (req, res) => {
    if (!isYTMusicInitialized) {
      return res.status(503).json({ error: 'YTMusic API not initialized' });
    }
    try {
      if (process.env.YTMUSIC_COOKIE) {
          // Try to fetch "Your Likes" playlist (ID: LM)
          try {
            const playlist: any = await ytmusic.getPlaylist('LM');
            // Normalize tracks
             const songs = (playlist.content || []).map((item: any) => ({
                videoId: item.videoId,
                name: item.name,
                artist: item.author || { name: 'Unknown' },
                thumbnails: item.thumbnails || [],
                duration: item.duration
            }));
            res.json({ songs });
          } catch (e) {
             console.warn("Failed to fetch LM playlist, falling back to home sections songs", e);
             const home = await ytmusic.getHomeSections();
             const songs = home.flatMap((section: any) => 
                (section.contents || []).filter((item: any) => item.type === 'SONG')
             );
             res.json({ songs });
          }
      } else {
          res.json({ songs: [], message: "Authentication required for library" });
      }
    } catch (error) {
      console.error('Library Songs error:', error);
      res.status(500).json({ error: 'Failed to fetch songs' });
    }
  });

// Library: Artists
apiRouter.get('/library/artists', async (req, res) => {
    if (!isYTMusicInitialized) {
      return res.status(503).json({ error: 'YTMusic API not initialized' });
    }
    try {
      if (process.env.YTMUSIC_COOKIE) {
          // Use Home Sections
          const home = await ytmusic.getHomeSections();
          const artists = home.flatMap((section: any) => 
            (section.contents || []).filter((item: any) => item.type === 'ARTIST')
          );
          res.json({ artists });
      } else {
          res.json({ artists: [], message: "Authentication required for library" });
      }
    } catch (error) {
      console.error('Library Artists error:', error);
      res.status(500).json({ error: 'Failed to fetch artists' });
    }
  });


// Get Playlist Details
apiRouter.get('/playlist/:id', async (req, res) => {
  try {
    const playlistId = req.params.id;
    if (!playlistId) {
      return res.status(400).json({ error: 'Missing playlistId' });
    }
    
    // Use ytmusic-api to get playlist videos
    const playlist = await ytmusic.getPlaylist(playlistId);
    
    // Normalize to Track interface
    // Note: The type definition says 'content' might not exist on PlaylistFull? 
    // Let's check the type def again. It says `getPlaylist` returns `PlaylistFull`.
    // `PlaylistFull` has `contents`? No, the type def shown earlier was `PlaylistDetailed`...
    // Wait, `getPlaylist` returns `PlaylistFull`. I need to check `PlaylistFull` definition.
    // I'll assume `content` or `tracks` or `videos`.
    // Based on common usage, it's often `content`.
    // I will cast to any to avoid TS errors.
    
    const pl: any = playlist;
    const tracks = (pl.content || pl.tracks || []).map((item: any) => ({
      id: item.videoId,
      title: item.name,
      artist: item.author?.name || item.artist?.name || 'Unknown',
      duration: item.duration || 0,
      thumbnail: item.thumbnails?.[0]?.url || '',
      url: `https://youtube.com/watch?v=${item.videoId}`
    }));

    res.json({ tracks, title: pl.name });
  } catch (error) {
    console.error('Playlist details error:', error);
    res.status(500).json({ error: 'Failed to get playlist details' });
  }
});

// Health Check
apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Search Tracks
apiRouter.get('/search', async (req, res) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ error: 'Missing query parameter' });
    }

    const results = await ytSearch(query);
    const videos = results.videos.slice(0, 10).map(video => ({
      id: video.videoId,
      title: video.title,
      artist: video.author.name,
      duration: video.duration.seconds,
      thumbnail: video.thumbnail,
      url: video.url
    }));

    res.json({ tracks: videos });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search tracks' });
  }
});

// Stream Audio
apiRouter.get('/stream/:videoId', async (req, res) => {
  try {
    const videoId = req.params.videoId;
    if (!videoId) {
      return res.status(400).json({ error: 'Missing videoId' });
    }

    // Pipe the stream directly to the client
    res.header('Content-Type', 'audio/mpeg');
    // Use full URL for reliability
    ytdl(`https://www.youtube.com/watch?v=${videoId}`, {
      filter: 'audioonly',
      quality: 'highestaudio',
      highWaterMark: 1 << 22, // 4MB buffer
      dlChunkSize: 0, // Disable chunking for smoother streaming
    }).pipe(res);

  } catch (error) {
    console.error('Stream error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to stream audio' });
    }
  }
});

// Chat with DJ (General LLM)
apiRouter.post('/chat', async (req, res) => {
    try {
        const { message, systemInstruction } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Missing message' });
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: message,
            config: {
                systemInstruction: systemInstruction,
            }
        });

        const text = response.text;
        res.json({ text });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Failed to generate chat response' });
    }
});

// Analyze Track Metadata (BPM, Key, Energy)
apiRouter.post('/analyze-track', async (req, res) => {
  try {
    const { title, artist } = req.body;
    if (!title || !artist) {
      return res.status(400).json({ error: 'Missing title or artist' });
    }

    const prompt = `
      Analyze the track "${title}" by "${artist}".
      Estimate the following musical properties based on your knowledge of the song:
      1. BPM (Beats Per Minute) - integer
      2. Key (e.g., C Minor, F# Major)
      3. Energy (Low, Medium, High)
      4. Genre (e.g., House, Dubstep, Hip Hop)

      Return ONLY a JSON object:
      {
        "bpm": 128,
        "key": "C Minor",
        "energy": "High",
        "genre": "Techno"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text;
    const data = JSON.parse(text);
    res.json(data);
  } catch (error) {
    console.error('Track analysis error:', error);
    // Fallback defaults if AI fails
    res.json({ bpm: 128, key: 'Am', energy: 'Medium', genre: 'Unknown' });
  }
});

// Generate DJ Commentary (Text)
apiRouter.post('/dj/commentary', async (req, res) => {
  try {
    const { currentTrack, nextTrack, vibe } = req.body;
    
    const prompt = `
      You are a world-class radio DJ.
      Current track: "${currentTrack.title}" by ${currentTrack.artist}.
      Next track: "${nextTrack.title}" by ${nextTrack.artist}.
      Vibe: ${vibe || 'energetic and smooth'}.
      
      Generate a short, punchy, and engaging transition script (max 2 sentences) to introduce the next track.
      Do not include "DJ:" or any script markers. Just the spoken text.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text;
    res.json({ text });
  } catch (error) {
    console.error('DJ Commentary error:', error);
    res.status(500).json({ error: 'Failed to generate commentary' });
  }
});

// Generate DJ Voice (TTS)
apiRouter.post('/dj/speech', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Missing text' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: {
        parts: [{ text }],
      },
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Female, energetic voice
          },
        },
      },
    });

    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!audioData) {
      throw new Error('No audio data received from Gemini');
    }

    // Return base64 audio directly
    res.json({ audio: audioData });
  } catch (error) {
    console.error('DJ Speech error:', error);
    res.status(500).json({ error: 'Failed to generate speech' });
  }
});

app.use('/api', apiRouter);

// Start Server
async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production (if built)
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
