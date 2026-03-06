cmake_minimum_required(VERSION 3.10)
project(CrimsonAIDJ VERSION 0.1.0 LANGUAGES C)

# Set C Standard to C99 for maximum portability
set(CMAKE_C_STANDARD 99)
set(CMAKE_C_STANDARD_REQUIRED ON)
set(CMAKE_C_EXTENSIONS OFF)

# Build optimization flags
set(CMAKE_C_FLAGS "-Wall -Wextra -O2 -fPIC")

# Define directories
set(SRC_DIR ${CMAKE_CURRENT_SOURCE_DIR}/src)
set(INC_DIR ${CMAKE_CURRENT_SOURCE_DIR}/include)

# Include directories
include_directories(${INC_DIR})
include_directories(${INC_DIR}/core)
include_directories(${INC_DIR}/ai)
include_directories(${INC_DIR}/http)

# Source files
set(SOURCES
    ${SRC_DIR}/main.c
    ${SRC_DIR}/core/audio_engine.c
    ${SRC_DIR}/ai/ai_client.c
    # http_server.c not implemented in POC yet
)

# Create executable
add_executable(crimson_backend ${SOURCES})

# miniaudio requires some math/pthread/dl linking on Linux
if(UNIX AND NOT APPLE)
    target_link_libraries(crimson_backend m pthread dl)
endif()

# Installation rules (optional)
install(TARGETS crimson_backend DESTINATION bin)
