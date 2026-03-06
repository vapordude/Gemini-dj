#include <iostream>
#include <string>
#include <vector>
#include <thread>
#include <chrono>

#include "sovereign_json.h"
#include "mcp_device_manager.h"

// Simple main server loop for Lux
int main() {
    std::cout << "Starting Lux Server..." << std::endl;

    // Initialize Device Manager
    sovereign::SimpleDeviceManager device_manager;
    device_manager.initialize();

    // Main Loop
    while (true) {
        std::cout << "Lux Server Running..." << std::endl;
        
        // Simulate device interaction
        std::vector<std::string> devices = device_manager.list_devices();
        for (const auto& device : devices) {
            std::cout << "Device: " << device << " Info: " << device_manager.get_device_info(device) << std::endl;
        }

        // Simulate state change
        device_manager.set_device_state("light_1", "on");

        std::this_thread::sleep_for(std::chrono::seconds(5));
    }

    device_manager.shutdown();
    return 0;
}
