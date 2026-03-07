#include "crimson/audio/AudioEngine.hpp"
#include "crimson/ai/AIClient.hpp"
#include "crimson/core/RingBuffer.hpp"
#include <iostream>
#include <thread>
#include <chrono>

using namespace crimson;

int main() {
    std::cout << "=========================================\n";
    std::cout << "    Crimson AI DJ - Modern C++ Engine    \n";
    std::cout << "    Architecture v2.0 - Sovereign SOTA   \n";
    std::cout << "=========================================\n\n";

    // 1. Initialize Audio Engine
    audio::AudioEngine engine;
    if (!engine.initialize()) {
        std::cerr << "Failed to initialize audio engine. Exiting.\n";
        return 1;
    }

    // 2. Initialize AI Client (Full Sovereign Mode config)
    ai::AIConfig config{
        .api_key = "",
        .base_url = "http://localhost:11434", // Local Llama.cpp / Ollama
        .llm_model = "llama3.2:3b",
        .tts_model = "kokoro-82m",
        .use_local_network = true,
        .local_model_path = "",
        .ace_step_model_path = ""
    };
    ai::AIClient ai(std::move(config));

    if (!ai.initialize()) {
        std::cerr << "Failed to initialize AI client. Exiting.\n";
        engine.shutdown();
        return 1;
    }

    // 3. Test Lock-Free Ring Buffer (10-second resilience simulation)
    std::cout << "\n--- Testing SPSC Ring Buffer ---\n";
    core::RingBuffer<int> buffer(1024);
    std::cout << "[RingBuffer] Size initialized to next power of 2: " << buffer.size() << "\n";

    // Simulate Decoder Thread filling
    for (int i = 0; i < 5; ++i) {
        if (buffer.push(i)) {
            std::cout << "[Decoder Thread] Pushed audio frame: " << i << "\n";
        }
    }

    // Simulate Audio Thread reading
    int out_frame = 0;
    while (buffer.pop(out_frame)) {
        std::cout << "[Audio Thread SCHED_FIFO] Read frame: " << out_frame << "\n";
    }

    // 4. Simulate AI DJ Workflow
    std::cout << "\n--- Simulating AI DJ Transition ---\n";

    engine.getDeckA().attachEngine(engine.getInternalEngine());
    engine.getDeckA().load("dummy_track_a.mp3"); // Real miniaudio decoding attempts

    // Generate real DJ commentary via REST API to Ollama
    if (auto commentary = ai.generateDJCommentary("Cyberpunk Beats", "Synthwave Drive", "high energy")) {
        std::cout << "[AI DJ Speak]: \"" << *commentary << "\"\n";
        ai.generateTTS(*commentary, "/tmp/dj_voice.wav");
    }

    engine.getDeckA().play();

    std::cout << "\nSimulating crossfade (A -> B)...\n";
    for (float pos = -1.0f; pos <= 1.0f; pos += 0.5f) {
        engine.setCrossfader(pos);
        std::this_thread::sleep_for(std::chrono::milliseconds(500));
    }

    engine.getDeckA().stop();

    std::cout << "\nShutting down engine...\n";
    ai.shutdown();
    engine.shutdown();

    return 0;
}
