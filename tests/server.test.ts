import { test } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import { app, state } from '../server.js';

test('GET /api/library/playlists returns 503 if YTMusic API is not initialized', async () => {
    // Save original state
    const originalState = state.isYTMusicInitialized;

    // Set to uninitialized
    state.isYTMusicInitialized = false;

    try {
        const response = await request(app).get('/api/library/playlists');

        assert.strictEqual(response.status, 503);
        assert.deepStrictEqual(response.body, { error: 'YTMusic API not initialized' });
    } finally {
        // Restore original state
        state.isYTMusicInitialized = originalState;
    }
});
