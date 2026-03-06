#define MINIAUDIO_IMPLEMENTATION
#include "miniaudio.h"

#include "core/audio_engine.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/* Global variables for POC */
static ma_engine ma_eng;
static ma_sound deck_a_sound;

void data_callback(ma_device* pDevice, void* pOutput, const void* pInput, ma_uint32 frameCount)
{
    (void)pDevice; /* Unused */
    /* Use the miniaudio engine to mix and output to the device */
    ma_engine_read_pcm_frames(&ma_eng, pOutput, frameCount, NULL);
    (void)pInput; /* Unused */
}

int audio_engine_init(audio_engine_t* engine) {
    if (engine == NULL) return -1;

    memset(engine, 0, sizeof(audio_engine_t));

    ma_result result;

    /* Initialize miniaudio engine */
    result = ma_engine_init(NULL, &ma_eng);
    if (result != MA_SUCCESS) {
        printf("Failed to initialize miniaudio engine: %d\n", result);
        return -1;
    }

    engine->_internal_engine = &ma_eng;
    engine->initialized = true;
    engine->crossfader = 0.0f;

    printf("[Audio Engine] Initialized successfully.\n");
    return 0;
}

void audio_engine_cleanup(audio_engine_t* engine) {
    if (engine && engine->initialized) {
        ma_sound_uninit(&deck_a_sound);
        ma_engine_uninit((ma_engine*)engine->_internal_engine);
        engine->initialized = false;
        printf("[Audio Engine] Cleaned up.\n");
    }
}

int audio_deck_load(deck_t* deck, const char* source) {
    if (!deck || !source) return -1;

    ma_result result;

    /*
     * In a production app, we would:
     * 1. Check if 'source' is a URL or file.
     * 2. If URL (YouTube), fork/exec `yt-dlp -o - <source> | ffmpeg ...` and pipe it
     *    to a custom `ma_data_source` callback for raw PCM.
     *
     * For this POC, we use miniaudio's built-in file decoder.
     */
    printf("[Audio Deck] Loading source: %s\n", source);

    result = ma_sound_init_from_file(&ma_eng, source, 0, NULL, NULL, &deck_a_sound);
    if (result != MA_SUCCESS) {
        printf("[Audio Deck] Failed to load sound: %s (Error: %d)\n", source, result);
        /* If it fails, we assume it's because the file isn't there in POC.
         * We won't crash, just report error. */
        return -1;
    }

    deck->_internal_sound = &deck_a_sound;
    deck->state = DECK_STOPPED;
    deck->volume = 1.0f;
    printf("[Audio Deck] Loaded successfully.\n");

    return 0;
}

void audio_deck_play(deck_t* deck) {
    if (deck && deck->_internal_sound) {
        ma_sound_start((ma_sound*)deck->_internal_sound);
        deck->state = DECK_PLAYING;
        printf("[Audio Deck] Playing.\n");
    }
}

void audio_deck_stop(deck_t* deck) {
    if (deck && deck->_internal_sound) {
        ma_sound_stop((ma_sound*)deck->_internal_sound);
        ma_sound_seek_to_pcm_frame((ma_sound*)deck->_internal_sound, 0);
        deck->state = DECK_STOPPED;
        printf("[Audio Deck] Stopped.\n");
    }
}

void audio_mixer_set_crossfader(audio_engine_t* engine, float pos) {
    if (!engine) return;

    /* Clamp pos to -1.0 .. 1.0 */
    if (pos < -1.0f) pos = -1.0f;
    if (pos > 1.0f) pos = 1.0f;

    engine->crossfader = pos;

    /* Simple linear crossfade logic for POC */
    /* A = left side (-1.0), B = right side (1.0) */

    float vol_a = 1.0f;
    float vol_b = 1.0f;

    if (pos > 0.0f) {
        vol_a = 1.0f - pos; /* A fades out as we move to B */
    } else if (pos < 0.0f) {
        vol_b = 1.0f + pos; /* B fades out as we move to A (-0.5 -> B=0.5) */
    }

    engine->deck_a.volume = vol_a;
    engine->deck_b.volume = vol_b;

    /* Apply to miniaudio sound objects if they exist */
    if (engine->deck_a._internal_sound) {
        ma_sound_set_volume((ma_sound*)engine->deck_a._internal_sound, vol_a);
    }
    if (engine->deck_b._internal_sound) {
        ma_sound_set_volume((ma_sound*)engine->deck_b._internal_sound, vol_b);
    }

    printf("[Mixer] Crossfader: %.2f (Deck A: %.2f, Deck B: %.2f)\n", pos, vol_a, vol_b);
}
