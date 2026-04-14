<script setup lang="ts">
import { computed } from 'vue'
import type { GroupBooking } from '@/domain/booking/entities/GroupBooking'
import type { RoomType } from '@/domain/booking/entities/RoomType'
import type { ValidationResult } from '@/domain/booking/rules/ValidationResult'

const props = defineProps<{
  booking: GroupBooking
  validationResult: ValidationResult
  roomTypes: RoomType[]
}>()

const resolvedRoomType = computed(() =>
  props.roomTypes.find(rt => rt.code === props.booking.assignment.roomTypeCode)?.defaultName ?? '—'
)

const nightCount = computed((): number | null => {
  const { checkIn, checkOut } = props.booking.stay
  if (!checkIn || !checkOut) return null
  const nights = Math.round(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86_400_000
  )
  return nights > 0 ? nights : null
})

const primaryContact = computed(() =>
  props.booking.participants.find(p => p.isPrimaryContact) ?? null
)
</script>

<template>
  <div class="rt-window rt-pixel-card sticky">

    <div class="rt-window__titlebar flex items-center justify-between gap-2">
      <div className="rt-window__controls">
        <span class="rt-dot"></span>
        <span class="rt-dot"></span>
        <span class="rt-dot"></span>
      </div>
      <p class="rt-sidebar-card__eyebrow">Summary</p>
      <span class="rt-badge">{{ booking.status }}</span>
    </div>

    <div class="rt-window__body">
      <div class="rt-stat-row__item">
        <span class="rt-stat-row__label">Group</span>
        <span class="rt-stat-row__value">{{ booking.groupName || '—' }}</span>
      </div>

      <div v-if="booking.externalReference" class="rt-stat-row__item">
        <span class="rt-stat-row__label">Ref</span>
        <span class="rt-stat-row__value">{{ booking.externalReference }}</span>
      </div>

      <div class="rt-stat-row__item">
        <span class="rt-stat-row__label">Check-in</span>
        <span class="rt-stat-row__value">{{ booking.stay.checkIn || '—' }}</span>
      </div>

      <div class="rt-stat-row__item">
        <span class="rt-stat-row__label">Check-out</span>
        <span class="rt-stat-row__value">{{ booking.stay.checkOut || '—' }}</span>
      </div>

      <div v-if="nightCount !== null" class="rt-stat-row__item">
        <span class="rt-stat-row__label">Duration</span>
        <span class="rt-stat-row__value">{{ nightCount }} {{ nightCount === 1 ? 'night' : 'nights' }}</span>
      </div>

      <div class="rt-stat-row__item">
        <span class="rt-stat-row__label">Room</span>
        <span class="rt-stat-row__value">{{ resolvedRoomType }}</span>
      </div>

      <div v-if="booking.assignment.unitLabel" class="rt-stat-row__item">
        <span class="rt-stat-row__label">Unit</span>
        <span class="rt-stat-row__value">{{ booking.assignment.unitLabel }}</span>
      </div>

      <div class="rt-stat-row__item">
        <span class="rt-stat-row__label">Participants</span>
        <span class="rt-stat-row__value">
          {{ booking.participants.length }} {{ booking.participants.length === 1 ? 'person' : 'people' }}
        </span>
      </div>

      <div class="rt-stat-row__item">
        <span class="rt-stat-row__label">Primary</span>
        <span class="rt-stat-row__value">
          {{ primaryContact ? `${primaryContact.firstName} ${primaryContact.lastName}` : '—' }}
        </span>
      </div>

    </div>

    <div class="rt-panel rt-panel--inset quote-field-row m-4">
      <div class="panel-header">
        <p class="rt-sidebar-card__eyebrow">Readiness</p>
      </div>
      <template v-if="validationResult.valid">
        <span class="rt-badge rt-badge--success">Ready to confirm</span>
      </template>
      <template v-else>
        <span class="rt-badge rt-badge--danger">
          {{ validationResult.errors.length }} {{ validationResult.errors.length === 1 ? 'issue' : 'issues' }}
        </span>
        <ul class="flex flex-col gap-1 mt-1">
          <li
            v-for="(error, i) in validationResult.errors"
            :key="i"
            class="rt-copy"
          >
            {{ error.message }}
          </li>
        </ul>
      </template>
    </div>

  </div>
</template>

<style scoped>
.panel-header {
  padding-bottom: 12px;
  border-bottom: 1px solid var(--rt-glass-border-soft);
}
</style>
