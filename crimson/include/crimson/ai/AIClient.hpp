#pragma once

#include <string>
#include <optional>

namespace crimson::ai {

struct AIConfig {
    std::string api_key;
    std::string base_url{"http://localhost:11434"}; // Default to local Llama.cpp
    std::string llm_model{"llama3.1:8b"};
    std::string tts_model{"piper"}; // Default to Piper
    bool use_local_network{true};
};

class AIClient {
public:
    explicit AIClient(AIConfig config);
    ~AIClient();

    bool initialize();
    void shutdown();

    std::optional<std::string> generateDJCommentary(
        const std::string& current_track,
        const std::string& next_track,
        const std::string& vibe);

    bool generateTTS(const std::string& text, const std::string& out_filepath);

    std::optional<std::string> analyzeTrackMetadata(
        const std::string& track_title,
        const std::string& artist);

private:
    AIConfig config_;
    bool initialized_{false};
};

} // namespace crimson::ai
