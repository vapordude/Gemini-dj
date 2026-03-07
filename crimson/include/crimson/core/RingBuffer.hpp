#pragma once
#include <atomic>
#include <vector>
#include <cstddef>
#include <new>

namespace crimson::core {

/**
 * Lock-free Single-Producer Single-Consumer Ring Buffer
 * Power-of-2 sized for fast modulo via bitwise AND
 * Used for: Audio decoder thread -> Audio callback thread
 */
template<typename T>
class RingBuffer {
public:
    explicit RingBuffer(size_t capacity)
        : size_(nextPowerOf2(capacity))
        , mask_(size_ - 1)
        , buffer_(static_cast<T*>(::operator new[](sizeof(T) * size_, std::align_val_t{alignof(T)})))
        , head_(0)
        , tail_(0)
    {}

    ~RingBuffer() {
        // Cleanup any remaining elements
        T item;
        while (pop(item)) {}
        ::operator delete[](buffer_, std::align_val_t{alignof(T)});
    }

    // Producer only (Decoder thread)
    bool push(const T& item) {
        const size_t current_head = head_.load(std::memory_order_relaxed);
        const size_t next_head = (current_head + 1) & mask_;

        if (next_head == tail_.load(std::memory_order_acquire)) {
            return false; // Full
        }

        new (&buffer_[current_head]) T(item);
        head_.store(next_head, std::memory_order_release);
        return true;
    }

    // Consumer only (Audio thread - SCHED_FIFO)
    bool pop(T& item) {
        const size_t current_tail = tail_.load(std::memory_order_relaxed);

        if (current_tail == head_.load(std::memory_order_acquire)) {
            return false; // Empty
        }

        item = buffer_[current_tail];
        buffer_[current_tail].~T();
        tail_.store((current_tail + 1) & mask_, std::memory_order_release);
        return true;
    }

    size_t size() const { return size_; }

    bool empty() const {
        return head_.load(std::memory_order_acquire) ==
               tail_.load(std::memory_order_acquire);
    }

private:
    static size_t nextPowerOf2(size_t n) {
        n--;
        n |= n >> 1;
        n |= n >> 2;
        n |= n >> 4;
        n |= n >> 8;
        n |= n >> 16;
        if constexpr (sizeof(size_t) == 8) {
            n |= n >> 32;
        }
        return n + 1;
    }

    const size_t size_;
    const size_t mask_;
    T* const buffer_;

    alignas(64) std::atomic<size_t> head_; // Producer writes
    alignas(64) std::atomic<size_t> tail_; // Consumer reads (cache line separation)
};

} // namespace crimson::core
