# Crimson AI DJ: Pure C Architecture & Design

## 1. Analysis of Current Node.js Backend (\`server.ts\`)

The current implementation is an Express.js server that acts as a proxy/backend for a web frontend. It provides several core functionalities:

1.  **YTMusic API Proxy (Library/Search):**
    *   Endpoints: \`/library/playlists\`, \`/library/songs\`, \`/library/artists\`, \`/playlist/:id\`, \`/search\`
    *   Current Tech: `ytmusic-api` (uses cookies for authenticated fetching) and `yt-search` (public search scraping).
    *   Purpose: Retrieve metadata (Track IDs, titles, artists, thumbnails).

2.  **Audio Streaming Proxy:**
    *   Endpoint: \`/stream/:videoId\`
    *   Current Tech: `@distube/ytdl-core` (extracts stream URL and pipes to client).
    *   Purpose: Stream YouTube audio directly to the frontend.

3.  **AI DJ / Commentary / Analysis:**
    *   Endpoints: \`/chat\`, \`/analyze-track\`, \`/dj/commentary\`, \`/dj/speech\`
    *   Current Tech: `@google/genai` (Gemini API for LLM and TTS).
    *   Purpose: Generate DJ banter, estimate BPM/Key/Energy via LLM (not DSP), and synthesize voice.

### Limitations of Current Architecture
*   **Performance & Portability:** Node.js/V8 is heavy for low-power devices (Raspberry Pi, mobile).
*   **Audio Engine:** Audio is streamed to the frontend for playback. The backend has no concept of mixing, fading, or DSP. True "live DJing" (crossfading, beatmatching, applying FX to multiple tracks simultaneously) is very difficult to coordinate synchronously across a network connection.
*   **Stability:** Node.js YouTube extractors are notoriously brittle.

## 2. The FOSS Pure C Architecture ("SOTA AI DJ")

To achieve the "SOTA AI DJ" that is stable, highly optimized, and capable of running locally or remotely on any architecture, we must move the **audio engine into the backend (or run it entirely locally as a daemon)**.

### Core Philosophy
*   **Pure C99/C11:** Maximum portability, minimum dependencies.
*   **FOSS Permissive:** MIT, BSD, ISC, or zlib licensed dependencies only.
*   **Modular Pipeline:** Clear separation between Network, AI, and DSP.

### Proposed FOSS C Stack

1.  **Audio Engine (DSP & Mixing): `miniaudio` (MIT-0 / Public Domain)**
    *   *Why:* Single-file header library. Phenomenal format decoding (MP3, FLAC, Vorbis), resamplers, mixing graphs, and hardware output. SOTA for permissive FOSS C audio.
    *   *Role:* Decodes audio streams, mixes multiple tracks (Deck A, Deck B, DJ Voice), applies FX (EQ, filters, crossfades), and outputs either to the local soundcard or streams via HTTP (e.g., Icecast/Raw PCM).

2.  **Network / HTTP Server: `mongoose` or `facil.io` or `Civetweb` (MIT)**
    *   *Recommendation:* `Civetweb` (MIT) or a heavily stripped custom async socket server. `mongoose` recently went GPL/commercial. `facil.io` (MIT) is excellent for high-performance Linux/BSD, but less portable to obscure OSes. Let's design around a generic HTTP abstraction, likely utilizing **mongoose (MIT version if available)** or building a minimal epoll/kqueue event loop if necessary. For now, we will abstract the HTTP layer. Let's aim for **`civetweb` (MIT)** as it's a robust embeddable C web server.
    *   *Role:* Serve the frontend static files and handle REST API requests.

3.  **Network Client (AI & Fetching): `libcurl` (MIT/X derivate)**
    *   *Role:* Execute REST calls to Gemini, local LLMs (Ollama/Llama.cpp APIs), and network auto-discovery endpoints.

4.  **JSON Parsing: `cJSON` (MIT)**
    *   *Role:* Parse incoming API requests and AI responses.

5.  **YouTube / Source Ingestion: Process Spawning (e.g., `yt-dlp` or `librespot`)**
    *   *Why:* Re-implementing streaming ciphers in pure C is a massive maintenance burden. We will use standard OS process spawning (`popen` or `fork/exec`) to call tools like `yt-dlp -o -` to pipe raw or encoded audio stdout directly into `miniaudio`'s custom decoder callbacks.

### Architecture Enhancements (The "AI DJ" SOTA Features)

*   **Real-time Beatmatching/Analysis:** Instead of relying on an LLM to "guess" BPM/Key, the C engine will utilize pure C DSP libraries like **minibpm (MIT)** or **BTrack (MIT)** for tempo estimation, and **kissfft (BSD)** for chromagram-based key detection.
*   **Stem Separation (Source Masking):** To achieve true SOTA AI DJing (like isolating vocals for a mashup), we will integrate the **ONNX Runtime C API (MIT)** to run highly-optimized models like **Demucs v4** locally, splitting tracks into stems within the engine.
*   **Multi-Deck Node Graph:** `miniaudio` allows creating a routing graph. We will implement:
    *   Node: Deck A Stream (with child stem nodes)
    *   Node: Deck B Stream (with child stem nodes)
    *   Node: TTS/DJ Voice Stream
    *   Node: FX Chain (Lowpass/Highpass filters for transitions)
*   **Local FOSS AI Stack (The "Autodiscovery" Layer):**
    *   **LLM:** Llama-3.1-8B, Qwen2.5-1.5B, or Phi-3-Mini running via a local `llama.cpp` server.
    *   **TTS:** **Piper TTS** or **Kokoro-82M** for ultra-fast, local, expressive voice generation.
*   **Headless Daemon Mode:** The C engine can run completely headless, outputting audio directly to a Raspberry Pi's DAC, controlled purely via REST API or websockets.

## 3. Minimum System Requirements

*   **Cloud API Mode (Gemini/Remote):**
    *   **Hardware:** Raspberry Pi 3/4, Mobile Device, or Low-end VPS.
    *   **RAM:** < 512MB (C Engine idles at ~20MB).
*   **Full Local SOTA Mode (On-device LLM + TTS + DSP):**
    *   **Hardware:** Raspberry Pi 5 (8GB) or modern x64 / Apple Silicon.
    *   **RAM:** 8GB Minimum (4GB LLM, 1GB TTS, 2GB OS/Audio Buffers).

## 4. System Design Map

\`\`\`
[Frontend Web App (React)]  <-- HTTP/WebSocket -->  [Civetweb API Server (C)]
                                                          |
                                      +-------------------+-------------------+
                                      |                   |                   |
                              [HTTP Routing]        [AI Module]         [Audio Engine]
                                      |             (libcurl + cJSON)   (miniaudio)
                                      |                   |                   |
                              [External APIs]     [Gemini/Local LLM]  [Stream Decoder Graph]
                              (YouTube Search)    [Local TTS Model]   (Pipes from yt-dlp)
                                                                              |
                                                                        [Soundcard / ICEcast]
\`\`\`

## Next Steps for Implementation
1. Define the `engine.h` (miniaudio wrapper for decks and mixing).
2. Define the `ai_client.h` (libcurl wrapper for Gemini/Local API).
3. Define the `server.h` (REST API routes).
