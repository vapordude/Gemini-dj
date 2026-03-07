#pragma once

#include <string>
#include <optional>
#include <vector>

namespace crimson::ai {

struct AIConfig {
    std::string api_key;
    std::string base_url{"http://localhost:11434"}; // Default to local Ollama
    std::string llm_model{"llama3.2:3b"};
    std::string tts_model{"kokoro-82m"}; // Default to Kokoro ONNX
    bool use_local_network{true};

    // Sovereign mode paths
    std::string local_model_path;
    std::string ace_step_model_path;
};

struct TrackAnalysis {
    float bpm{0.0f};
    std::string key;
    std::string genre;
    float energy{0.0f}; // 0.0 - 1.0
    std::vector<std::string> tags;
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

    std::optional<TrackAnalysis> analyzeTrackMetadata(
        const std::string& track_title,
        const std::string& artist);

    bool separateStems(
        const std::string& input_path,
        const std::string& output_dir
    );

private:
    AIConfig config_;
    bool initialized_{false};
};

} // namespace crimson::ai
