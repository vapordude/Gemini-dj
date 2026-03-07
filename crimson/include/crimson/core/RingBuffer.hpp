#pragma once

#include <atomic>
#include <vector>
#include <cstddef>
#include <cassert>

namespace crimson::core {

/**
 * Single-Producer Single-Consumer (SPSC) Lock-Free Ring Buffer.
 * Crucial for the audio pipeline to prevent audio dropouts (under-runs)
 * when piping yt-dlp stdout into miniaudio on the SCHED_FIFO thread.
 */
template <typename T>
class RingBuffer {
public:
    explicit RingBuffer(size_t size) : size_(nextPowerOfTwo(size)), buffer_(size_) {
        read_index_.store(0, std::memory_order_relaxed);
        write_index_.store(0, std::memory_order_relaxed);
    }

    bool push(const T& item) {
        size_t write_pos = write_index_.load(std::memory_order_relaxed);
        size_t next_write_pos = (write_pos + 1) & (size_ - 1);

        if (next_write_pos == read_index_.load(std::memory_order_acquire)) {
            return false; // Buffer is full
        }

        buffer_[write_pos] = item;
        write_index_.store(next_write_pos, std::memory_order_release);
        return true;
    }

    bool pop(T& out_item) {
        size_t read_pos = read_index_.load(std::memory_order_relaxed);

        if (read_pos == write_index_.load(std::memory_order_acquire)) {
            return false; // Buffer is empty
        }

        out_item = buffer_[read_pos];
        read_index_.store((read_pos + 1) & (size_ - 1), std::memory_order_release);
        return true;
    }

    [[nodiscard]] size_t size() const {
        return size_;
    }

    [[nodiscard]] size_t available() const {
        size_t write_pos = write_index_.load(std::memory_order_acquire);
        size_t read_pos = read_index_.load(std::memory_order_acquire);
        return (write_pos - read_pos) & (size_ - 1);
    }

private:
    static size_t nextPowerOfTwo(size_t v) {
        v--;
        v |= v >> 1;
        v |= v >> 2;
        v |= v >> 4;
        v |= v >> 8;
        v |= v >> 16;
        // Prevent undefined behavior on 32-bit systems (where size_t is 32 bits)
        if constexpr (sizeof(size_t) > 4) {
            v |= v >> 32;
        }
        v++;
        return v;
    }

    size_t size_;
    std::vector<T> buffer_;
    alignas(64) std::atomic<size_t> read_index_{0};  // Prevent false sharing
    alignas(64) std::atomic<size_t> write_index_{0};
};

} // namespace crimson::core
