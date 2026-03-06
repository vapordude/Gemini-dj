#include "ai/ai_client.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/*
 * This is a stub implementation for the POC.
 * A real implementation would use libcurl (`curl_easy_init`, `curl_easy_setopt`)
 * to POST JSON to the Gemini API (`https://generativelanguage.googleapis.com/v1beta/models/...`)
 * and parse the response with cJSON.
 */

int ai_client_init(ai_client_t* client, const ai_config_t* config) {
    if (!client) return -1;

    memset(client, 0, sizeof(ai_client_t));
    if (config) {
        memcpy(&client->config, config, sizeof(ai_config_t));
    } else {
        /* Fallback / Default config */
        strcpy(client->config.base_url, "https://generativelanguage.googleapis.com");
        strcpy(client->config.llm_model, "gemini-2.5-flash");
    }

    client->initialized = true;
    printf("[AI Client] Initialized. Engine: %s, Network: %s\n",
           client->config.llm_model,
           client->config.use_local_network ? "Local Autodiscovery" : "Remote Default");

    return 0;
}

void ai_client_cleanup(ai_client_t* client) {
    if (client && client->initialized) {
        client->initialized = false;
        printf("[AI Client] Cleaned up.\n");
    }
}

int ai_generate_dj_commentary(ai_client_t* client,
                              const char* current_track_title,
                              const char* next_track_title,
                              const char* vibe,
                              char* out_buffer,
                              int out_size) {
    if (!client || !client->initialized || !out_buffer) return -1;

    /* Stub response instead of actual HTTP POST for POC */
    snprintf(out_buffer, out_size,
             "That was %s, keeping the %s vibes going, coming up next is %s. Let's go!",
             current_track_title ? current_track_title : "a great track",
             vibe ? vibe : "good",
             next_track_title ? next_track_title : "another banger");

    printf("[AI Client] Generated Commentary: %s\n", out_buffer);
    return 0;
}
