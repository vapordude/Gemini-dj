#ifndef CRIMSON_HTTP_SERVER_H
#define CRIMSON_HTTP_SERVER_H

#include <stdbool.h>

/**
 * Configuration for the HTTP API Server
 */
typedef struct {
    int port;                  /* Default: 3000 */
    char document_root[512];   /* Path to serve static frontend files */
    bool enable_cors;
} http_server_config_t;

/**
 * Server State
 */
typedef struct {
    http_server_config_t config;
    bool running;
    void* _internal_ctx; /* Pointer to internal server context (e.g., civetweb ctx) */
} http_server_t;

/* --- Server API --- */

/**
 * Starts the HTTP server on a background thread.
 * @param config Configuration options.
 * @return 0 on success.
 */
int http_server_start(http_server_t* server, const http_server_config_t* config);

/**
 * Stops the HTTP server gracefully.
 */
void http_server_stop(http_server_t* server);


/* --- Core Route Handlers (Implemented Internally) --- */

/* Note: In a pure C web server, routes are usually registered via callbacks.
   The implementation will map these functions to specific REST endpoints:

   GET  /api/health            -> Returns {"status":"ok"}
   GET  /api/library/playlists -> Fetches local/network playlists
   GET  /api/search?q=...      -> Executes yt-dlp search or network search
   POST /api/dj/commentary     -> Calls ai_client -> Returns JSON text
   POST /api/dj/speech         -> Calls ai_client TTS -> Returns Audio
   GET  /api/stream/:id        -> Legacy proxy stream (if needed)

   NEW API FOR ENGINE CONTROL:
   POST /api/engine/load       -> { "deck": "A", "url": "..." }
   POST /api/engine/play       -> { "deck": "A" }
   POST /api/engine/crossfade  -> { "pos": 1.0 }
*/

#endif /* CRIMSON_HTTP_SERVER_H */
