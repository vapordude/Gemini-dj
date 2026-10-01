#include "mcp_device_manager.h"
#include <iostream>
#include <algorithm>

namespace sovereign {

SimpleDeviceManager::SimpleDeviceManager() {
    devices["light_1"] = "off";
    devices["thermostat_1"] = "20.0";
    devices["lock_1"] = "locked";
}

void SimpleDeviceManager::initialize() {
    std::cout << "Device Manager Initialized." << std::endl;
}

void SimpleDeviceManager::shutdown() {
    std::cout << "Device Manager Shutdown." << std::endl;
}

std::string SimpleDeviceManager::get_device_info(const std::string& device_id) {
    auto it = devices.find(device_id);
    if (it != devices.end()) {
        return "{\"id\": \"" + device_id + "\", \"state\": \"" + it->second + "\"}";
    }
    return "{\"error\": \"Device not found\"}";
}

bool SimpleDeviceManager::set_device_state(const std::string& device_id, const std::string& state) {
    auto it = devices.find(device_id);
    if (it != devices.end()) {
        it->second = state;
        std::cout << "Set device " << device_id << " to " << state << std::endl;
        return true;
    }
    return false;
}

std::vector<std::string> SimpleDeviceManager::list_devices() {
    std::vector<std::string> device_list;
    for (const auto& pair : devices) {
        device_list.push_back(pair.first);
    }
    return device_list;
}

} // namespace sovereign
