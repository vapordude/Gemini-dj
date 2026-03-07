#include "crimson/audio/Deck.hpp"
#include "crimson/audio/miniaudio.h"
#include <iostream>
#include <stdexcept>

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

bool Deck::load(const std::string& source, void* engine_ptr) {
    std::cout << "[Deck " << id_ << "] Loading: " << source << "\n";

    // Cleanup previous sound if reloading
    if (status_ != DeckStatus::Stopped && status_ != DeckStatus::Error) {
        stop();
        ma_sound_uninit(static_cast<ma_sound*>(internal_sound_));
    }

    if (!engine_ptr) {
        status_ = DeckStatus::Error;
        return false;
    }

    ma_result result = ma_sound_init_from_file(
        static_cast<ma_engine*>(engine_ptr),
        source.c_str(),
        0,
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
    if (internal_sound_) {
        ma_sound_stop(static_cast<ma_sound*>(internal_sound_));
        ma_sound_seek_to_pcm_frame(static_cast<ma_sound*>(internal_sound_), 0);
        status_ = DeckStatus::Stopped;
        std::cout << "[Deck " << id_ << "] Stopped.\n";
    }
}

void Deck::setVolume(float volume) {
    if (internal_sound_) {
        ma_sound_set_volume(static_cast<ma_sound*>(internal_sound_), volume);
    }
    volume_ = volume;
}

} // namespace crimson::audio
