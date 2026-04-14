<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { bookingService } from '@/services/booking'
import { useGroupBookingEditor } from '@/composables/booking/useGroupBookingEditor'
import BookingForm from '@/components/booking/BookingForm.vue'
import BookingParticipantsSection from '@/components/booking/BookingParticipantsSection.vue'
import BookingSummarySidebar from '@/components/booking/BookingSummarySidebar.vue'
import { ROOM_TYPES } from '@/domain/booking/entities/RoomType'
import ThemeWindowControls from '@/components/ThemeWindowControls.vue'
import { useTheme } from '@/composables/useTheme'
import SavedBookingsPanel from '@/components/booking/SavedBookingsPanel.vue'
import type { GroupBooking } from '@/domain/booking/entities/GroupBooking'

const {
  booking,
  isLoading,
  isSaving,
  loadError,
  saveError,
  validationResult,
  canConfirm,
  createBooking,
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

const savedBookings = ref<GroupBooking[]>([])

onMounted(async () => {
  await createBooking({ groupName: '' })
  savedBookings.value = await bookingService.list()
})

const { activeTheme, setTheme } = useTheme()
</script>

<template>
  <p v-if="isLoading" class="rt-copy px-6 pt-6">Creating…</p>
  <p v-else-if="loadError" class="rt-copy px-6 pt-6" style="color: var(--rt-danger)">{{ loadError }}</p>
  <div v-else-if="booking" class="rt-sidebar-layout max-w-[1280px] mx-auto h-full pb-6">
    <aside class="overflow-y-auto flex flex-col gap-4">
      <BookingSummarySidebar
        :booking="booking"
        :validationResult="validationResult"
        :roomTypes="ROOM_TYPES"
      />
      <SavedBookingsPanel
        :bookings="savedBookings"
        :activeBookingId="booking.id"
      />
    </aside>
    <article class="rt-window rt-pixel-card flex flex-col overflow-hidden">
      <header class="rt-window__titlebar">
        <div class="rt-window__controls">
          <ThemeWindowControls :activeTheme="activeTheme" @update:activeTheme="setTheme" />
        </div>
        <h2 class="rt-window__title">New Group Booking</h2>
        <span class="rt-badge">stable</span>
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
    </article>
  </div>
</template>
