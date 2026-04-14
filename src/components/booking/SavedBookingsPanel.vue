<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { GroupBooking } from '@/domain/booking/entities/GroupBooking'

defineProps<{
  bookings: GroupBooking[]
  activeBookingId: string | null
}>()

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>

<template>
  <div class="rt-window rt-pixel-card">

    <div class="rt-window__titlebar">
      <div class="rt-window__controls">
        <span class="rt-dot"></span>
        <span class="rt-dot"></span>
        <span class="rt-dot"></span>
      </div>
      <p class="rt-sidebar-card__eyebrow">Saved bookings</p>
      <span v-if="bookings.length > 0" class="rt-badge">{{ bookings.length }}</span>
    </div>

    <div class="rt-window__body">

      <p v-if="bookings.length === 0" class="rt-copy">
        No saved bookings yet.
      </p>

      <div v-else class="booking-list">
      <RouterLink
        v-for="booking in bookings"
        :key="booking.id"
        :to="{ name: 'booking-edit', params: { id: booking.id } }"
        class="booking-row"
        :class="{ 'is-active': booking.id === activeBookingId }"
      >
        <div class="booking-row__main">
          <span class="rt-stat-row__value booking-row__name">
            {{ booking.groupName || 'Untitled booking' }}
          </span>
          <span
            class="rt-badge"
            :class="booking.status === 'confirmed' ? 'rt-badge--success' : ''"
          >
            {{ booking.status }}
          </span>
        </div>
        <span class="rt-stat-row__label">{{ formatDate(booking.updatedAt) }}</span>
      </RouterLink>
      </div>

    </div>

  </div>
</template>

<style scoped>
.booking-list {
  max-height: 11rem;
  overflow-y: auto;
}

.booking-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 0;
  border-bottom: 1px solid var(--rt-glass-border-soft);
  text-decoration: none;
  cursor: pointer;
  transition: opacity 120ms ease;
}

.booking-row:last-child {
  border-bottom: none;
}

.booking-row:hover {
  opacity: 0.8;
}

.booking-row.is-active {
  opacity: 1;
  border-left: 2px solid var(--rt-accent);
  padding-left: 8px;
  margin-left: -8px;
}

.booking-row__main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.booking-row__name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
