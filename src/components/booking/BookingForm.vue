<script setup lang="ts">
import { computed } from 'vue'
import type { GroupBooking } from '@/domain/booking/entities/GroupBooking'
import type { RoomType, RoomTypeCode } from '@/domain/booking/entities/RoomType'
import type { StayDateRange } from '@/domain/booking/value-objects/StayDateRange'
import type { ValidationResult } from '@/domain/booking/rules/ValidationResult'

const props = defineProps<{
  booking: GroupBooking
  roomTypes: RoomType[]
  validationResult: ValidationResult
  isSaving: boolean
  canConfirm: boolean
  saveError: string | null
}>()

const emit = defineEmits<{
  'update:groupName': [value: string]
  'update:externalReference': [value: string | null]
  'update:notes': [value: string | null]
  'update:stay': [value: StayDateRange]
  'update:roomTypeCode': [value: RoomTypeCode | null]
  'save': []
  'confirm': []
}>()

const fieldErrors = computed<Record<string, string>>(() =>
  Object.fromEntries(props.validationResult.errors.map(e => [e.field, e.message]))
)

function onRoomTypeChange(event: Event): void {
  const value = (event.target as HTMLSelectElement).value
  emit('update:roomTypeCode', value === '' ? null : (value as RoomTypeCode))
}

function errorStyle(field: string): Record<string, string> {
  return fieldErrors.value[field] ? { borderColor: 'var(--rt-danger)' } : {}
}
</script>

<template>
  <div className="rt-panel rt-panel--inset quote-field-row">
    <form class="flex flex-col gap-4" @submit.prevent>
      <div class="grid gap-4 lg:grid-cols-2">
        <!-- Left column: identity fields -->
        <div class="flex flex-col gap-4">

          <div class="rt-panel rt-panel--inset quote-field-row flex flex-col gap-4">
            <div class="panel-header">
              <p class="rt-sidebar-card__eyebrow">Booking details</p>
            </div>

            <div class="flex flex-col gap-1">
              <label class="rt-copy" for="groupName">Group name</label>
              <input
                id="groupName"
                class="rt-input"
                type="text"
                :style="errorStyle('groupName')"
                :value="booking.groupName"
                @input="emit('update:groupName', ($event.target as HTMLInputElement).value)"
              />
              <span v-if="fieldErrors['groupName']" class="text-xs" style="color: var(--rt-danger)">
                {{ fieldErrors['groupName'] }}
              </span>
            </div>

            <div class="flex flex-col gap-1">
              <label class="rt-copy" for="externalReference">External reference</label>
              <input
                id="externalReference"
                class="rt-input"
                type="text"
                :value="booking.externalReference ?? ''"
                @input="emit('update:externalReference', ($event.target as HTMLInputElement).value || null)"
              />
            </div>
          </div>

          <div class="rt-panel rt-panel--inset quote-field-row flex flex-col gap-4">
            <div class="panel-header">
              <p class="rt-sidebar-card__eyebrow">Stay dates</p>
            </div>

            <div class="flex gap-4">
              <div class="flex flex-col gap-1 flex-1">
                <label class="rt-copy" for="checkIn">Check-in</label>
                <input
                  id="checkIn"
                  class="rt-input"
                  type="date"
                  :style="errorStyle('stay.checkIn')"
                  :value="booking.stay.checkIn"
                  @change="emit('update:stay', { ...booking.stay, checkIn: ($event.target as HTMLInputElement).value })"
                />
                <span v-if="fieldErrors['stay.checkIn']" class="text-xs" style="color: var(--rt-danger)">
                  {{ fieldErrors['stay.checkIn'] }}
                </span>
              </div>

              <div class="flex flex-col gap-1 flex-1">
                <label class="rt-copy" for="checkOut">Check-out</label>
                <input
                  id="checkOut"
                  class="rt-input"
                  type="date"
                  :style="errorStyle('stay.checkOut')"
                  :value="booking.stay.checkOut"
                  @change="emit('update:stay', { ...booking.stay, checkOut: ($event.target as HTMLInputElement).value })"
                />
                <span v-if="fieldErrors['stay.checkOut']" class="text-xs" style="color: var(--rt-danger)">
                  {{ fieldErrors['stay.checkOut'] }}
                </span>
              </div>
            </div>
          </div>

        </div>

        <!-- Right column: assignment + notes -->
        <div class="flex flex-col gap-4">

          <div class="rt-panel rt-panel--inset quote-field-row flex flex-col gap-4">
            <div class="panel-header">
              <p class="rt-sidebar-card__eyebrow">Room assignment</p>
            </div>

            <div class="flex flex-col gap-1">
              <label class="rt-copy" for="roomType">Room type</label>
              <select
                id="roomType"
                class="rt-input"
                :style="errorStyle('assignment.roomTypeCode')"
                :value="booking.assignment.roomTypeCode ?? ''"
                @change="onRoomTypeChange"
              >
                <option value="">— select —</option>
                <option v-for="rt in roomTypes" :key="rt.code" :value="rt.code">
                  {{ rt.defaultName }}
                </option>
              </select>
              <span v-if="fieldErrors['assignment.roomTypeCode']" class="text-xs" style="color: var(--rt-danger)">
                {{ fieldErrors['assignment.roomTypeCode'] }}
              </span>
            </div>
          </div>

          <div class="rt-panel rt-panel--inset quote-field-row flex flex-col gap-4 flex-1">
            <div class="panel-header">
              <p class="rt-sidebar-card__eyebrow">Notes</p>
            </div>
            <textarea
              class="rt-input flex-1"
              :value="booking.notes ?? ''"
              @input="emit('update:notes', ($event.target as HTMLTextAreaElement).value || null)"
            />
          </div>

        </div>

      </div>

      <div role="alert" class="alert alert-error" v-if="saveError">
        <span>{{ saveError }}</span>
      </div>

      <div class="flex justify-between">
        <div class="rt-toolbar__group">
          <button
            class="rt-btn"
            type="button"
            :disabled="isSaving"
            @click="emit('save')"
          >
            {{ isSaving ? 'Saving…' : 'Save draft' }}
          </button>
        </div>
        <div class="rt-toolbar__group">
          <button
            class="rt-btn rt-btn--primary"
            type="button"
            :disabled="!canConfirm"
            @click="emit('confirm')"
          >
            Confirm booking
          </button>
        </div>
      </div>

    </form>
  </div>
  
</template>

<style scoped>
.panel-header {
  padding-bottom: 12px;
  border-bottom: 1px solid var(--rt-glass-border-soft);
}
</style>
