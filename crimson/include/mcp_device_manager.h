#ifndef MCP_DEVICE_MANAGER_H
#define MCP_DEVICE_MANAGER_H

#include <string>
#include <vector>
#include <map>

namespace sovereign {

class DeviceManager {
public:
    virtual ~DeviceManager() = default;

    virtual void initialize() = 0;
    virtual void shutdown() = 0;

    virtual std::string get_device_info(const std::string& device_id) = 0;
    virtual bool set_device_state(const std::string& device_id, const std::string& state) = 0;
    virtual std::vector<std::string> list_devices() = 0;
};

} // namespace sovereign

#endif // MCP_DEVICE_MANAGER_H
