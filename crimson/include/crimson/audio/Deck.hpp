#pragma once

#include <string>

namespace crimson::audio {

enum class DeckStatus {
    Stopped = 0,
    Playing,
    Paused,
    Loading,
    Error
};

struct AudioTrack {
    std::string id;
    std::string title;
    std::string artist;
    float duration_sec{0.0f};
    float bpm{0.0f};
};

class Deck {
public:
    Deck(int id);
    ~Deck();

    // Delete copy and move constructors for simplicity in audio resources
    Deck(const Deck&) = delete;
    Deck& operator=(const Deck&) = delete;

    void attachEngine(void* engine);

    bool load(const std::string& source);
    void play();
    void pause();
    void stop();
    void setVolume(float volume);

    // Stem mix levels for Demucs integration (future)
    void setStemMix(float drums, float bass, float other, float vocals);

    [[nodiscard]] int getId() const { return id_; }
    [[nodiscard]] float getVolume() const { return volume_; }
    [[nodiscard]] DeckStatus getStatus() const { return status_; }

    // Internal pointer to the miniaudio ma_sound object
    void* getInternalSound() const { return internal_sound_; }

private:
    int id_;
    DeckStatus status_{DeckStatus::Stopped};
    AudioTrack current_track_;
    float volume_{1.0f};
    float pitch_{1.0f};

    float stem_mix_[4] = {1.0f, 1.0f, 1.0f, 1.0f}; // drums, bass, other, vocals

    void* internal_sound_{nullptr}; // ma_sound
    void* engine_{nullptr};         // ma_engine reference
};

} // namespace crimson::audio
