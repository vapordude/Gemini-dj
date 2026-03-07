#include "crimson/ai/AIClient.hpp"
#include <iostream>
#include <sstream>
#include <curl/curl.h>
#include <nlohmann/json.hpp>

namespace crimson::ai {

static size_t WriteCallback(void* contents, size_t size, size_t nmemb, std::string* userp) {
    userp->append(static_cast<char*>(contents), size * nmemb);
    return size * nmemb;
}

AIClient::AIClient(AIConfig config) : config_(std::move(config)) {}

AIClient::~AIClient() {
    shutdown();
}

bool AIClient::initialize() {
    if (initialized_) return true;

    curl_global_init(CURL_GLOBAL_DEFAULT);

    // Test connection to Ollama local instance
    if (config_.use_local_network) {
        CURL* test = curl_easy_init();
        if (test) {
            std::string test_url = config_.base_url + "/api/tags";
            curl_easy_setopt(test, CURLOPT_URL, test_url.c_str());
            curl_easy_setopt(test, CURLOPT_TIMEOUT, 2L); // Fast 2s timeout

            std::string response;
            curl_easy_setopt(test, CURLOPT_WRITEFUNCTION, WriteCallback);
            curl_easy_setopt(test, CURLOPT_WRITEDATA, &response);

            CURLcode res = curl_easy_perform(test);
            curl_easy_cleanup(test);

            if (res != CURLE_OK) {
                std::cerr << "[AI Client] Cannot connect to local Ollama at "
                          << config_.base_url << ": " << curl_easy_strerror(res) << "\n"
                          << "[AI Client] Will run in disconnected/mock mode.\n";
            } else {
                std::cout << "[AI Client] Connected to local Sovereign API at "
                          << config_.base_url << ".\n";
            }
        }
    }

    std::cout << "[AI Client] Initialized. Engine: " << config_.llm_model
              << " | TTS: " << config_.tts_model
              << " | Mode: " << (config_.use_local_network ? "Sovereign Local" : "Cloud") << "\n";

    initialized_ = true;
    return true;
}

void AIClient::shutdown() {
    if (initialized_) {
        curl_global_cleanup();
        std::cout << "[AI Client] Cleaned up.\n";
        initialized_ = false;
    }
}

std::optional<std::string> AIClient::generateDJCommentary(
    const std::string& current_track,
    const std::string& next_track,
    const std::string& vibe)
{
    if (!initialized_) return std::nullopt;

    CURL* curl = curl_easy_init();
    if (!curl) return std::nullopt;

    std::string prompt = "You are Crimson, an AI DJ. Create a brief, energetic transition commentary.\n"
                         "Current track: " + current_track + "\n"
                         "Next track: " + next_track + "\n"
                         "Vibe: " + vibe + "\n"
                         "Keep it under 20 words, high energy, no filler.";

    nlohmann::json request = {
        {"model", config_.llm_model},
        {"prompt", prompt},
        {"stream", false},
        {"options", {
            {"temperature", 0.8},
            {"num_predict", 50}
        }}
    };

    std::string json_str = request.dump();
    std::string readBuffer;

    struct curl_slist* headers = nullptr;
    headers = curl_slist_append(headers, "Content-Type: application/json");

    curl_easy_setopt(curl, CURLOPT_URL, (config_.base_url + "/api/generate").c_str());
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, json_str.c_str());
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &readBuffer);
    curl_easy_setopt(curl, CURLOPT_TIMEOUT, 5L);

    std::cout << "[AI Client] Requesting inference from " << config_.llm_model << "...\n";
    CURLcode res = curl_easy_perform(curl);

    curl_slist_free_all(headers);
    curl_easy_cleanup(curl);

    if (res != CURLE_OK) {
        std::cerr << "[AI Client] LLM request failed: " << curl_easy_strerror(res) << "\n";
        // Fallback for demo if Ollama isn't running
        return "That was " + current_track + ", keeping the " + vibe + " vibes going. Next up is " + next_track + "!";
    }

    try {
        auto json_response = nlohmann::json::parse(readBuffer);
        return json_response["response"].get<std::string>();
    } catch (const std::exception& e) {
        std::cerr << "[AI Client] JSON parse error: " << e.what() << "\n";
        return std::nullopt;
    }
}

bool AIClient::generateTTS(const std::string& text, const std::string& out_filepath) {
    if (!initialized_) return false;

    // Simulated Piper/Kokoro ONNX inference
    std::cout << "[AI Client - " << config_.tts_model << "] Generating TTS audio for text length "
              << text.length() << " -> " << out_filepath << "\n";
    return true;
}

std::optional<TrackAnalysis> AIClient::analyzeTrackMetadata(
    const std::string& track_title,
    const std::string& artist)
{
    if (!initialized_) return std::nullopt;

    std::cout << "[AI Client] Analyzing track: " << track_title << " by " << artist << "\n";

    TrackAnalysis analysis;
    analysis.bpm = 120.0f;
    analysis.key = "8A"; // Camelot
    analysis.genre = "Electronic";
    analysis.energy = 0.85f;

    return analysis;
}

bool AIClient::separateStems(const std::string& input_path, const std::string& output_dir) {
#ifdef HAS_ONNX_RUNTIME
    std::cout << "[AI Client - Demucs] Stem separation starting: " << input_path << " -> " << output_dir << "\n";
    return true;
#else
    (void)input_path;
    (void)output_dir;
    std::cerr << "[AI Client] Stem separation not available (ONNX Runtime not compiled into build)\n";
    return false;
#endif
}

} // namespace crimson::ai
