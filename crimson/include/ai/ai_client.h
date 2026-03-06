#ifndef CRIMSON_AI_CLIENT_H
#define CRIMSON_AI_CLIENT_H

#include <stdbool.h>

/**
 * Configuration for the AI Service (Gemini or Local API like Ollama)
 */
typedef struct {
    char api_key[128];
    char base_url[256];      /* e.g., "https://generativelanguage.googleapis.com" or "http://localhost:11434" */
    char llm_model[64];      /* e.g., "gemini-2.5-flash" or "llama3" */
    char tts_model[64];      /* e.g., "gemini-2.5-flash-preview-tts" or "piper" */
    bool use_local_network;  /* If true, try to autodiscover local models */
} ai_config_t;

/**
 * Represents the AI Client State
 */
typedef struct {
    ai_config_t config;
    bool initialized;
} ai_client_t;

/* --- Initialization --- */

/**
 * Initializes the libcurl handle and AI client state.
 * @param config The configuration to use. If NULL, tries to load from ENV.
 * @return 0 on success.
 */
int ai_client_init(ai_client_t* client, const ai_config_t* config);

/**
 * Cleans up curl resources.
 */
void ai_client_cleanup(ai_client_t* client);


/* --- DJ Intelligence APIs --- */

/**
 * Generates DJ banter/commentary for a transition between two tracks.
 * @param current_track_title Title of track ending.
 * @param next_track_title Title of track starting.
 * @param vibe The current vibe (e.g., "energetic", "chill").
 * @param out_buffer Pre-allocated buffer to store the generated text.
 * @param out_size Size of out_buffer.
 * @return 0 on success.
 */
int ai_generate_dj_commentary(ai_client_t* client,
                              const char* current_track_title,
                              const char* next_track_title,
                              const char* vibe,
                              char* out_buffer,
                              int out_size);

/**
 * Generates Speech (TTS) from text and saves it to a temporary file or buffer.
 * @param text The commentary text to speak.
 * @param out_filepath The path to save the generated audio file (e.g., .wav or .mp3).
 * @return 0 on success.
 */
int ai_generate_tts(ai_client_t* client, const char* text, const char* out_filepath);

/**
 * Analyzes track metadata (BPM, Key, Energy) using LLM heuristics (fallback if DSP fails).
 * @param track_title The track title.
 * @param artist The track artist.
 * @param out_json Pre-allocated buffer for the JSON result.
 * @param out_size Size of out_json.
 * @return 0 on success.
 */
int ai_analyze_track_metadata(ai_client_t* client,
                              const char* track_title,
                              const char* artist,
                              char* out_json,
                              int out_size);


#endif /* CRIMSON_AI_CLIENT_H */
