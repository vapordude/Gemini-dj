#include "mcp_device_manager.h"
#include <iostream>
#include <algorithm>

namespace sovereign {

class SimpleDeviceManager : public DeviceManager {
private:
    std::map<std::string, std::string> devices;

public:
    SimpleDeviceManager() {
        devices["light_1"] = "off";
        devices["thermostat_1"] = "20.0";
        devices["lock_1"] = "locked";
    }

    void initialize() override {
        std::cout << "Device Manager Initialized." << std::endl;
    }

    void shutdown() override {
        std::cout << "Device Manager Shutdown." << std::endl;
    }

    std::string get_device_info(const std::string& device_id) override {
        if (devices.find(device_id) != devices.end()) {
            return "{\"id\": \"" + device_id + "\", \"state\": \"" + devices[device_id] + "\"}";
        }
        return "{\"error\": \"Device not found\"}";
    }

    bool set_device_state(const std::string& device_id, const std::string& state) override {
        if (devices.find(device_id) != devices.end()) {
            devices[device_id] = state;
            std::cout << "Set device " << device_id << " to " << state << std::endl;
            return true;
        }
        return false;
    }

    std::vector<std::string> list_devices() override {
        std::vector<std::string> device_list;
        for (const auto& pair : devices) {
            device_list.push_back(pair.first);
        }
        return device_list;
    }
};

} // namespace sovereign
