#!/bin/bash
export GEMINI_API_KEY="dummy_key_for_testing"
pnpm dev &
SERVER_PID=$!
echo $SERVER_PID > .server.pid
sleep 3
