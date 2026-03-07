#define MINIAUDIO_IMPLEMENTATION
#include "crimson/audio/miniaudio.h"

#include "crimson/audio/AudioEngine.hpp"
#include <iostream>
#include <algorithm> // for std::clamp

namespace crimson::audio {

AudioEngine::AudioEngine()
    : deck_a_(std::make_unique<Deck>(0)),
      deck_b_(std::make_unique<Deck>(1)),
      deck_voice_(std::make_unique<Deck>(2)) {
    internal_engine_ = new ma_engine();
}

AudioEngine::~AudioEngine() {
    shutdown();
    if (internal_engine_) {
        delete static_cast<ma_engine*>(internal_engine_);
        internal_engine_ = nullptr;
    }
}

bool AudioEngine::initialize() {
    if (initialized_) return true;

    ma_result result = ma_engine_init(nullptr, static_cast<ma_engine*>(internal_engine_));
    if (result != MA_SUCCESS) {
        std::cerr << "[AudioEngine] Failed to initialize miniaudio: " << result << "\n";
        return false;
    }

    initialized_ = true;
    std::cout << "[AudioEngine] Initialized successfully.\n";
    return true;
}

void AudioEngine::shutdown() {
    if (initialized_ && internal_engine_) {
        // Decks will destroy themselves via unique_ptr,
        // but we uninit the engine first to stop playback.
        ma_engine_uninit(static_cast<ma_engine*>(internal_engine_));
        initialized_ = false;
        std::cout << "[AudioEngine] Cleaned up.\n";
    }
}

void AudioEngine::setCrossfader(float pos) {
    // Clamp between -1.0 and 1.0
    crossfader_ = std::clamp(pos, -1.0f, 1.0f);

    float vol_a = 1.0f;
    float vol_b = 1.0f;

    if (crossfader_ > 0.0f) {
        vol_a = 1.0f - crossfader_;
    } else if (crossfader_ < 0.0f) {
        vol_b = 1.0f + crossfader_;
    }

    deck_a_->setVolume(vol_a);
    deck_b_->setVolume(vol_b);

    std::cout << "[Mixer] Crossfader: " << crossfader_
              << " (A: " << vol_a << ", B: " << vol_b << ")\n";
}

void AudioEngine::autoTransition(int duration_ms) {
    std::cout << "[Mixer] Auto transition (" << duration_ms << "ms) not fully implemented.\n";
}

} // namespace crimson::audio
