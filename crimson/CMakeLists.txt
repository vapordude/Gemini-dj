cmake_minimum_required(VERSION 3.10)
project(CrimsonAIDJ VERSION 2.0.0 LANGUAGES CXX)

# Require Modern C++ (Desloppify)
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Build optimization and warnings
set(CMAKE_CXX_FLAGS "-Wall -Wextra -Wpedantic -O3 -fPIC")

# Thread safety optimization (for atomic lock-free structures)
add_compile_options(-pthread)

# Find libcurl for HTTP Client (AI Client / Llama.cpp / Ollama)
find_package(CURL REQUIRED)

# Define directories
set(SRC_DIR ${CMAKE_CURRENT_SOURCE_DIR}/src)
set(INC_DIR ${CMAKE_CURRENT_SOURCE_DIR}/include)

# Include directories
include_directories(${INC_DIR})

# Source files
set(SOURCES
    ${SRC_DIR}/main.cpp
    ${SRC_DIR}/audio/Deck.cpp
    ${SRC_DIR}/audio/AudioEngine.cpp
    ${SRC_DIR}/ai/AIClient.cpp
)

# Create executable
add_executable(crimson_backend ${SOURCES})

# miniaudio requires some math/pthread/dl linking on Linux
if(UNIX AND NOT APPLE)
    target_link_libraries(crimson_backend m pthread dl)
endif()

# Link CURL for the AI Client
target_link_libraries(crimson_backend CURL::libcurl)

# Installation rules (optional)
install(TARGETS crimson_backend DESTINATION bin)
