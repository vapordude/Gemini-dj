#pragma once

#include "Deck.hpp"
#include <memory>
#include <atomic>

namespace crimson::audio {

class AudioEngine {
public:
    AudioEngine();
    ~AudioEngine();

    AudioEngine(const AudioEngine&) = delete;
    AudioEngine& operator=(const AudioEngine&) = delete;

    bool initialize();
    void shutdown();

    Deck& getDeckA() { return *deck_a_; }
    Deck& getDeckB() { return *deck_b_; }
    Deck& getVoiceDeck() { return *deck_voice_; }

    void setCrossfader(float pos);
    float getCrossfader() const { return crossfader_.load(); }

    void autoTransition(int duration_ms);

    [[nodiscard]] void* getInternalEngine() const { return internal_engine_; }

private:
    bool initialized_{false};
    std::atomic<float> crossfader_{0.0f}; // -1.0 (A) to 1.0 (B)

    std::unique_ptr<Deck> deck_a_;
    std::unique_ptr<Deck> deck_b_;
    std::unique_ptr<Deck> deck_voice_;

    void* internal_engine_{nullptr}; // pointer to ma_engine
};

} // namespace crimson::audio
