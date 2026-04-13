<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { bookingService } from '@/services/booking'
import { useGroupBookingEditor } from '@/composables/booking/useGroupBookingEditor'
import BookingForm from '@/components/booking/BookingForm.vue'
import BookingParticipantsSection from '@/components/booking/BookingParticipantsSection.vue'
import BookingSummarySidebar from '@/components/booking/BookingSummarySidebar.vue'
import { ROOM_TYPES } from '@/domain/booking/entities/RoomType'

const route = useRoute()

const {
  booking,
  isLoading,
  isSaving,
  loadError,
  saveError,
  validationResult,
  canConfirm,
  loadBooking,
  setGroupName,
  setExternalReference,
  setNotes,
  setStay,
  setRoomTypeCode,
  addParticipant,
  updateParticipant,
  setPrimaryContact,
  removeParticipant,
  saveBooking,
  confirmBooking,
} = useGroupBookingEditor(bookingService)

onMounted(() => {
  loadBooking(route.params.id as string)
})

</script>

<template>
  <p v-if="isLoading" class="rt-copy px-6 pt-6">Loading…</p>
  <p v-else-if="loadError" class="rt-copy px-6 pt-6" style="color: var(--rt-danger)">{{ loadError }}</p>
  <div v-else-if="booking" class="rt-sidebar-layout max-w-[1280px] mx-auto h-full px-6 pb-6">
    <aside class="overflow-y-auto">
      <BookingSummarySidebar
        :booking="booking"
        :validationResult="validationResult"
        :roomTypes="ROOM_TYPES"
      />
    </aside>
    <div class="rt-window flex flex-col overflow-hidden">
      <header class="rt-window__titlebar">
        <h1 class="rt-window__title">{{ booking.groupName || 'Group Booking' }}</h1>
        <div class="flex items-center gap-3">
          <div class="rt-window__controls">
            <span class="rt-dot"></span>
            <span class="rt-dot"></span>
            <span class="rt-dot"></span>
          </div>
          <span class="rt-badge rt-badge--success">{{ booking.status }}</span>
        </div>
      </header>
      <div class="rt-window__body flex flex-col gap-6 overflow-y-auto flex-1 min-h-0">
        <BookingForm
          :booking="booking"
          :roomTypes="ROOM_TYPES"
          :validationResult="validationResult"
          :isSaving="isSaving"
          :canConfirm="canConfirm"
          :saveError="saveError"
          @update:groupName="setGroupName"
          @update:externalReference="setExternalReference"
          @update:notes="setNotes"
          @update:stay="setStay"
          @update:roomTypeCode="setRoomTypeCode"
          @save="saveBooking"
          @confirm="confirmBooking"
        />
        <BookingParticipantsSection
          :participants="booking.participants"
          :errors="validationResult.errors"
          @add="addParticipant"
          @update="updateParticipant"
          @remove="removeParticipant"
          @set-primary="setPrimaryContact"
        />
      </div>
    </div>
  </div>
</template>
