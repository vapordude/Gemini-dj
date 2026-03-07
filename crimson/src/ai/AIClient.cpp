#include "crimson/ai/AIClient.hpp"
#include <iostream>
#include <format> // C++20 formatting

namespace crimson::ai {

AIClient::AIClient(AIConfig config) : config_(std::move(config)) {}

AIClient::~AIClient() {
    shutdown();
}

bool AIClient::initialize() {
    if (initialized_) return true;

    // In a real app, initialize libcurl or ONNX Runtime API here.
    std::cout << "[AI Client] Initialized. Engine: " << config_.llm_model
              << " | TTS: " << config_.tts_model
              << " | Mode: " << (config_.use_local_network ? "Sovereign Local" : "Cloud") << "\n";

    initialized_ = true;
    return true;
}

void AIClient::shutdown() {
    if (initialized_) {
        std::cout << "[AI Client] Cleaned up.\n";
        initialized_ = false;
    }
}

std::optional<std::string> AIClient::generateDJCommentary(
    const std::string& current_track,
    const std::string& next_track,
    const std::string& vibe)
{
    if (!initialized_) return std::nullopt;

    // Simulated Llama 3.2 3B Inference
    std::string commentary = "That was " + current_track +
                             ", keeping the " + vibe + " vibes going. " +
                             "Coming up next is " + next_track + ". Let's go!";

    std::cout << "[AI Client - Llama] Generated Commentary: \"" << commentary << "\"\n";
    return commentary;
}

bool AIClient::generateTTS(const std::string& text, const std::string& out_filepath) {
    if (!initialized_) return false;

    // Simulated Piper/Kokoro inference
    std::cout << "[AI Client - Kokoro] Generating TTS audio for text length " << text.length()
              << " to: " << out_filepath << "\n";
    return true;
}

std::optional<std::string> AIClient::analyzeTrackMetadata(
    const std::string& track_title,
    const std::string& artist)
{
    if (!initialized_) return std::nullopt;

    std::cout << "[AI Client] Analyzing track: " << track_title << " by " << artist << "\n";
    return "{\"bpm\": 120, \"key\": \"C Minor\"}";
}

} // namespace crimson::ai
