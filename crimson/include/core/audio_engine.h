#ifndef CRIMSON_AUDIO_ENGINE_H
#define CRIMSON_AUDIO_ENGINE_H

#include <stdbool.h>

/* Forward declarations for miniaudio types to keep header clean */
typedef struct ma_engine ma_engine;
typedef struct ma_sound ma_sound;

/**
 * Deck Status
 */
typedef enum {
    DECK_STOPPED = 0,
    DECK_PLAYING,
    DECK_PAUSED,
    DECK_LOADING,
    DECK_ERROR
} deck_status_t;

/**
 * Audio Track Metadata
 */
typedef struct {
    char id[64];
    char title[256];
    char artist[256];
    float duration_sec;
    float bpm;           /* Estimated or detected BPM */
} audio_track_t;

/**
 * A "Deck" in the AI DJ setup (e.g., Deck A, Deck B, Deck C for Voice)
 */
typedef struct {
    int id;              /* 0 for Deck A, 1 for Deck B, 2 for TTS Voice */
    deck_status_t state;
    audio_track_t current_track;
    float volume;        /* 0.0 to 1.0 */
    float pitch;         /* Playback speed (1.0 = normal) for beatmatching */
    void* _internal_sound; /* Pointer to miniaudio sound object (allocated dynamically) */
} deck_t;

/**
 * Main Audio Engine State
 */
typedef struct {
    bool initialized;
    deck_t deck_a;
    deck_t deck_b;
    deck_t deck_voice;
    float crossfader;    /* -1.0 (Deck A full) to 1.0 (Deck B full) */
    void* _internal_engine; /* Pointer to miniaudio engine object */
} audio_engine_t;

/* --- Core Engine API --- */

/**
 * Initializes the miniaudio engine and routing graph.
 * @return 0 on success, non-zero on error.
 */
int audio_engine_init(audio_engine_t* engine);

/**
 * Uninitializes the engine and frees resources.
 */
void audio_engine_cleanup(audio_engine_t* engine);


/* --- Deck API --- */

/**
 * Loads a track from a URL or local file into a specific deck.
 * For URLs (like YouTube), this might spawn a yt-dlp process and pipe the output.
 * @param deck The deck to load into.
 * @param source URL or file path.
 * @return 0 on success.
 */
int audio_deck_load(deck_t* deck, const char* source);

/**
 * Plays the currently loaded track on the deck.
 */
void audio_deck_play(deck_t* deck);

/**
 * Pauses the deck.
 */
void audio_deck_pause(deck_t* deck);

/**
 * Stops and clears the deck.
 */
void audio_deck_stop(deck_t* deck);

/**
 * Sets the volume of a specific deck (0.0 to 1.0).
 */
void audio_deck_set_volume(deck_t* deck, float volume);


/* --- DJ Mixer API --- */

/**
 * Adjusts the crossfader position.
 * @param engine The audio engine.
 * @param pos -1.0 (A) to 1.0 (B). 0.0 is center.
 */
void audio_mixer_set_crossfader(audio_engine_t* engine, float pos);

/**
 * Automates a crossfade from the current deck to the other deck over 'duration_ms'.
 * This is the core "AI DJ" transition mechanic.
 */
void audio_mixer_auto_transition(audio_engine_t* engine, int duration_ms);


#endif /* CRIMSON_AUDIO_ENGINE_H */
