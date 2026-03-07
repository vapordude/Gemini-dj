# CRIMSON AI DJ ENGINE v2.0 - Architecture Specification

## 1. Gap Analysis Summary

| Gap | SOTA Solution | Implementation |
| :--- | :--- | :--- |
| **Audio Analysis vs LLM Guessing** | Hybrid DSP: minibpm + BTrack + Chromagram/KISS FFT | Multi-algorithm fusion with confidence weighting; 85-90% key detection accuracy |
| **Stem Separation** | Demucs v4 via ONNX Runtime C API | Real-time 4-stem isolation (drums/bass/other/vocals); 50ms latency on RTX 4050 |
| **Event Loop / Threading** | Thread pools + lock-free queues | 4-way separation: Audio (SCHED_FIFO), HTTP (Civetweb workers), AI (GPU), Decoder (I/O) |
| **Buffer Management** | Lock-free ring buffer + decoder thread | 10-second buffer; handles network stalls without dropouts |

---

## 2. SOTA FOSS Stack (Production-Ready)

| Component | Model/Library | Size | License | Performance |
| :--- | :--- | :--- | :--- | :--- |
| **Music Generation** | ACE-Step-1.5 (Q8_0) | 7.7GB | Check repo | SOTA (Suno v5 level), 8s/4min track |
| **Stem Separation** | Demucs v4 (ONNX) | 80MB | MIT | 4 stems, 50ms latency |
| **TTS** | Kokoro-82M (ONNX) | 200MB | Apache-2.0 | 50ms, SOTA quality |
| **LLM** | Llama-3.2-3B (Q8_0) | 3.2GB | Llama 3.2 | 40 tok/s, DJ commentary |
| **BPM Detection** | minibpm + BTrack | <100KB | MIT | ±0.1 BPM accuracy |
| **Key Detection** | Chromagram + KISS FFT | 50KB | BSD | 85-90% accuracy |
| **FX/Analysis** | Soundpipe | 500KB | MIT | Moog filters, reverb, onset |

---

## 3. Critical Implementation Details

### 3.1 Hybrid BPM Detection (minibpm + BTrack + Soundpipe)
*   **minibpm:** Statistical approach, best for EDM/consistent beats.
*   **BTrack:** Causal tracking, handles tempo changes.
*   **Soundpipe:** Perceptual onset detection.
*   **Fusion:** Weighted average (0.5/0.3/0.2) with confidence calculation.

### 3.2 Stem Separation Node (ONNX Runtime C API)
\`\`\`c
// Real-time 4-stem mixing in miniaudio graph
CrimsonStemNode* node = crimson_stem_node_create(engine);
crimson_stem_set_mix(node, STEM_VOCALS, 1.0f);   // Acapella
crimson_stem_set_mix(node, STEM_DRUMS, 0.0f);    // Remove drums
crimson_stem_set_mix(node, STEM_BASS, 1.2f);     // Boost bass
\`\`\`

### 3.3 Lock-Free Thread Architecture
*   **Audio Thread:** \`SCHED_FIFO\`, priority 80, never blocks.
*   **AI Thread Pool:** 4 threads, GPU inference (ACE-Step, Demucs).
*   **Decoder Thread:** I/O bound, feeds ring buffer.
*   **HTTP Workers:** 16 Civetweb threads, async handlers.

### 3.4 Stream Buffer (10-second resilience)
*   Lock-free SPSC (Single-Producer, Single-Consumer) ring buffer (power of 2 for fast modulo).
*   Decoder thread fills from \`yt-dlp\` stdout.
*   Audio callback drains; under-runs logged but recoverable.

---

## 4. Minimum System Requirements (Updated)

| Tier | Hardware | RAM | VRAM | Models |
| :--- | :--- | :--- | :--- | :--- |
| **Cloud API** | Pi 3/4 | 512MB | - | Remote only |
| **Edge Hybrid** | Pi 5 (8GB) | 8GB | - | TTS + analysis local; ACE-Step remote |
| **Full Sovereign** | RTX 4050 6GB | 16GB | 6GB | All local with model swapping |
| **Studio** | RTX 4090 | 32GB | 24GB | FP16, concurrent inference |

---

## 5. VRAM Management Strategy (RTX 4050 6GB Example)

**ACE-Step Generation Mode (Total: ~6.5GB)**
*   Text Encoder: 800MB (always resident)
*   LM: 4.5GB
*   DiT: 2.5GB
*   VAE: 350MB
*   Working: 400MB
*(Action: Unload Llama during generation)*

**Llama Commentary Mode (Total: ~6.2GB)**
*   Text Encoder: 800MB
*   VAE: 350MB
*   Llama 3.2 3B: 3.5GB
*   Demucs: 1.2GB
*   Working: 400MB
*(Action: Unload ACE-Step LM/DiT)*

**Demucs Stem Mode**
*   Demucs: 1.2GB (always resident)
*   Kokoro: 250MB (always resident)
*   Remaining: ~4.5GB for ACE-Step or Llama

*Note: Model Swapping occurs via an AI scheduler. 2-3s switch time is acceptable for the DJ workflow.*

---

## 6. 12-Week Development Roadmap

| Phase | Weeks | Focus |
| :--- | :--- | :--- |
| **Foundation** | 1-2 | Lock-free buffers, thread pools, Civetweb |
| **Analysis** | 3-4 | minibpm/BTrack, chromagram, Soundpipe FX |
| **Streaming** | 5-6 | yt-dlp ring buffer, decoder thread, health monitoring |
| **AI Core** | 7-8 | ACE-Step C++, ONNX Runtime, Demucs, Kokoro |
| **Mixing** | 9-10 | Beat-synced crossfade, stem mixing, commentary |
| **Optimization**| 11-12 | VRAM management, Pi 5 ARM, latency tuning |

---

## 7. Handoff Checklist for Implementation
- [ ] ONNX Runtime 1.17+ with CUDA support installed
- [ ] ACE-Step license verified (or MusicGen fallback ready)
- [ ] RTX 4050 dev environment with 6GB VRAM
- [ ] Pi 5 (8GB) test environment
- [ ] Model download script (10GB+ verified)
- [ ] All libraries: MIT/BSD/Apache-2.0 only
- [ ] Thread safety audit plan
- [ ] Audio callback profiling setup
