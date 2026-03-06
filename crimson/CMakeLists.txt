cmake_minimum_required(VERSION 3.10)
project(CrimsonCore)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include_directories(include)

add_executable(lux_server src/server/lux_server.cpp src/server/mcp_device_manager.cpp)

target_link_libraries(lux_server pthread)
