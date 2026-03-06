#ifndef SOVEREIGN_JSON_H
#define SOVEREIGN_JSON_H

#include <string>
#include <vector>
#include <map>
#include <sstream>
#include <iostream>

namespace sovereign {

enum class JsonType { Null, Boolean, Number, String, Array, Object };

class JsonValue {
public:
    JsonType type = JsonType::Null;
    bool bool_val = false;
    double num_val = 0.0;
    std::string str_val;
    std::vector<JsonValue> arr_val;
    std::map<std::string, JsonValue> obj_val;

    JsonValue() = default;
    JsonValue(bool b) : type(JsonType::Boolean), bool_val(b) {}
    JsonValue(double n) : type(JsonType::Number), num_val(n) {}
    JsonValue(int n) : type(JsonType::Number), num_val(static_cast<double>(n)) {}
    JsonValue(const std::string& s) : type(JsonType::String), str_val(s) {}
    JsonValue(const char* s) : type(JsonType::String), str_val(s) {}

    static JsonValue array() { JsonValue v; v.type = JsonType::Array; return v; }
    static JsonValue object() { JsonValue v; v.type = JsonType::Object; return v; }

    void push_back(const JsonValue& v) {
        if (type == JsonType::Array) arr_val.push_back(v);
    }

    void insert(const std::string& key, const JsonValue& v) {
        if (type == JsonType::Object) obj_val[key] = v;
    }

    std::string dump() const {
        std::stringstream ss;
        switch (type) {
            case JsonType::Null: ss << "null"; break;
            case JsonType::Boolean: ss << (bool_val ? "true" : "false"); break;
            case JsonType::Number: ss << num_val; break;
            case JsonType::String: ss << "\"" << escape(str_val) << "\""; break;
            case JsonType::Array: {
                ss << "[";
                for (size_t i = 0; i < arr_val.size(); ++i) {
                    if (i > 0) ss << ",";
                    ss << arr_val[i].dump();
                }
                ss << "]";
                break;
            }
            case JsonType::Object: {
                ss << "{";
                size_t i = 0;
                for (const auto& pair : obj_val) {
                    if (i > 0) ss << ",";
                    ss << "\"" << escape(pair.first) << "\":" << pair.second.dump();
                    i++;
                }
                ss << "}";
                break;
            }
        }
        return ss.str();
    }

private:
    std::string escape(const std::string& s) const {
        std::string res;
        for (char c : s) {
            if (c == '"') res += "\\\"";
            else if (c == '\\') res += "\\\\";
            else if (c == '\b') res += "\\b";
            else if (c == '\f') res += "\\f";
            else if (c == '\n') res += "\\n";
            else if (c == '\r') res += "\\r";
            else if (c == '\t') res += "\\t";
            else res += c;
        }
        return res;
    }
};

} // namespace sovereign

#endif // SOVEREIGN_JSON_H
