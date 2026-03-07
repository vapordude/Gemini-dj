#include "crimson/audio/Deck.hpp"
#include "crimson/audio/miniaudio.h"
#include <iostream>
#include <algorithm> // for std::clamp

namespace crimson::audio {

Deck::Deck(int id) : id_(id) {
    internal_sound_ = new ma_sound();
}

Deck::~Deck() {
    stop();
    if (internal_sound_) {
        ma_sound_uninit(static_cast<ma_sound*>(internal_sound_));
        delete static_cast<ma_sound*>(internal_sound_);
        internal_sound_ = nullptr;
    }
}

void Deck::attachEngine(void* engine) {
    engine_ = engine;
}

bool Deck::load(const std::string& source) {
    std::cout << "[Deck " << id_ << "] Loading: " << source << "\n";

    if (!engine_) {
        std::cerr << "[Deck " << id_ << "] Error: No engine attached!\n";
        status_ = DeckStatus::Error;
        return false;
    }

    // Cleanup previous sound if reloading
    if (status_ != DeckStatus::Stopped && status_ != DeckStatus::Error) {
        stop();
        ma_sound_uninit(static_cast<ma_sound*>(internal_sound_));
    }

    // Load asynchronously from stream using MA_SOUND_FLAG_STREAM
    ma_result result = ma_sound_init_from_file(
        static_cast<ma_engine*>(engine_),
        source.c_str(),
        MA_SOUND_FLAG_STREAM | MA_SOUND_FLAG_DECODE,
        nullptr,
        nullptr,
        static_cast<ma_sound*>(internal_sound_)
    );

    if (result != MA_SUCCESS) {
        std::cerr << "[Deck " << id_ << "] Failed to load: " << source
                  << " (Error code: " << result << ")\n";
        status_ = DeckStatus::Error;
        return false;
    }

    status_ = DeckStatus::Stopped;
    std::cout << "[Deck " << id_ << "] Loaded successfully.\n";
    return true;
}

void Deck::play() {
    if (internal_sound_ && status_ != DeckStatus::Playing && status_ != DeckStatus::Error) {
        ma_sound_start(static_cast<ma_sound*>(internal_sound_));
        status_ = DeckStatus::Playing;
        std::cout << "[Deck " << id_ << "] Playing.\n";
    }
}

void Deck::pause() {
    if (internal_sound_ && status_ == DeckStatus::Playing) {
        ma_sound_stop(static_cast<ma_sound*>(internal_sound_));
        status_ = DeckStatus::Paused;
        std::cout << "[Deck " << id_ << "] Paused.\n";
    }
}

void Deck::stop() {
    if (internal_sound_ && status_ != DeckStatus::Stopped && status_ != DeckStatus::Error) {
        ma_sound_stop(static_cast<ma_sound*>(internal_sound_));
        ma_sound_seek_to_pcm_frame(static_cast<ma_sound*>(internal_sound_), 0);
        status_ = DeckStatus::Stopped;
        std::cout << "[Deck " << id_ << "] Stopped.\n";
    }
}

void Deck::setVolume(float volume) {
    volume_ = std::clamp(volume, 0.0f, 1.0f);
    if (internal_sound_) {
        ma_sound_set_volume(static_cast<ma_sound*>(internal_sound_), volume_);
    }
}

void Deck::setStemMix(float drums, float bass, float other, float vocals) {
    stem_mix_[0] = drums;
    stem_mix_[1] = bass;
    stem_mix_[2] = other;
    stem_mix_[3] = vocals;
    // TODO: Apply to Demucs separated ONNX stems node
}

} // namespace crimson::audio
