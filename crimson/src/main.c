#include "core/audio_engine.h"
#include "ai/ai_client.h"
#include <stdio.h>
#include <unistd.h>
#include <string.h>

/**
 * Main entry point for the Crimson AI DJ Backend Proof of Concept.
 * This demonstrates how the C engine initializes, handles AI logic, and prepares the audio mixer.
 */
int main(void) {
    printf("=========================================\n");
    printf("    Crimson AI DJ - Pure C Engine POC    \n");
    printf("=========================================\n\n");

    /* 1. Initialize Audio Engine */
    audio_engine_t engine;
    if (audio_engine_init(&engine) != 0) {
        printf("Failed to initialize audio engine. Exiting.\n");
        return 1;
    }

    /* 2. Initialize AI Client */
    ai_client_t ai;
    ai_config_t ai_cfg = {
        .use_local_network = false
    };
    strcpy(ai_cfg.llm_model, "gemini-2.5-flash");
    strcpy(ai_cfg.base_url, "https://generativelanguage.googleapis.com");

    if (ai_client_init(&ai, &ai_cfg) != 0) {
        printf("Failed to initialize AI client.\n");
        audio_engine_cleanup(&engine);
        return 1;
    }

    /* 3. Simulate "SOTA AI DJ" workflow */
    printf("\n--- Simulating AI DJ Transition ---\n");

    /* a. Load tracks (Simulated file paths) */
    audio_deck_load(&engine.deck_a, "dummy_track_a.mp3"); // Will fail gracefully in POC

    /* b. AI generates commentary based on metadata */
    char commentary[512];
    ai_generate_dj_commentary(&ai, "Cyberpunk Beats", "Synthwave Drive", "high energy", commentary, sizeof(commentary));

    /* c. Play Deck A */
    audio_deck_play(&engine.deck_a);

    /* d. Crossfade simulation */
    printf("\nSimulating crossfade (A -> B)...\n");
    audio_mixer_set_crossfader(&engine, -1.0f); // 100% Deck A
    usleep(500000); // 500ms
    audio_mixer_set_crossfader(&engine, -0.5f);
    usleep(500000); // 500ms
    audio_mixer_set_crossfader(&engine, 0.0f);  // 50/50 Mix
    usleep(500000); // 500ms
    audio_mixer_set_crossfader(&engine, 0.5f);
    usleep(500000); // 500ms
    audio_mixer_set_crossfader(&engine, 1.0f);  // 100% Deck B

    /* e. Stop */
    audio_deck_stop(&engine.deck_a);

    /* 4. Cleanup */
    printf("\nShutting down engine...\n");
    ai_client_cleanup(&ai);
    audio_engine_cleanup(&engine);

    return 0;
}
