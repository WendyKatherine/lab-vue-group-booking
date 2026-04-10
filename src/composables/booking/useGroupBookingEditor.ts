import { ref, computed } from "vue";
import type { Ref, ComputedRef } from "vue";
import type { GroupBooking } from "@/domain/booking/entities/GroupBooking";
import type { Participant } from "@/domain/booking/entities/Participant";
import type { StayDateRange } from "@/domain/booking/value-objects/StayDateRange";
import type { UnitAssignment } from "@/domain/booking/value-objects/UnitAssignment";
import type { ValidationResult } from "@/domain/booking/rules/ValidationResult";
import type { BookingService } from "@/services/booking/BookingService";
import type { CreateBookingInput, UpdateBookingInput } from "@/services/booking/service-types";
import { validateBookingForConfirmation } from "@/domain/booking/rules/validateBookingForConfirmation";

const EMPTY_VALIDATION: ValidationResult = { valid: false, errors: [] };

export function useGroupBookingEditor(service: BookingService) {
  const booking: Ref<GroupBooking | null> = ref(null);
  const isLoading: Ref<boolean> = ref(false);
  const isSaving: Ref<boolean> = ref(false);
  const loadError: Ref<string | null> = ref(null);
  const saveError: Ref<string | null> = ref(null);

  const validationResult: ComputedRef<ValidationResult> = computed(() =>
    booking.value !== null ? validateBookingForConfirmation(booking.value) : EMPTY_VALIDATION
  );

  const canConfirm: ComputedRef<boolean> = computed(
    () => validationResult.value.valid && !isSaving.value
  );

  async function loadBooking(id: string): Promise<void> {
    isLoading.value = true;
    loadError.value = null;
    try {
      booking.value = await service.getById(id);
    } catch (err) {
      loadError.value = err instanceof Error ? err.message : "Failed to load booking";
    } finally {
      isLoading.value = false;
    }
  }

  async function createBooking(input: CreateBookingInput): Promise<void> {
    isLoading.value = true;
    loadError.value = null;
    try {
      booking.value = await service.create(input);
    } catch (err) {
      loadError.value = err instanceof Error ? err.message : "Failed to create booking";
    } finally {
      isLoading.value = false;
    }
  }

  function setGroupName(value: string): void {
    if (booking.value === null) return;
    booking.value = { ...booking.value, groupName: value };
  }

  function setExternalReference(value: string | null): void {
    if (booking.value === null) return;
    booking.value = { ...booking.value, externalReference: value };
  }

  function setNotes(value: string | null): void {
    if (booking.value === null) return;
    booking.value = { ...booking.value, notes: value };
  }

  function setStay(stay: StayDateRange): void {
    if (booking.value === null) return;
    booking.value = { ...booking.value, stay };
  }

  function setAssignment(assignment: UnitAssignment): void {
    if (booking.value === null) return;
    booking.value = { ...booking.value, assignment };
  }

  function addParticipant(participant: Participant): void {
    if (booking.value === null) return;
    booking.value = {
      ...booking.value,
      participants: [...booking.value.participants, participant],
    };
  }

  function updateParticipant(updated: Participant): void {
    if (booking.value === null) return;
    booking.value = {
      ...booking.value,
      participants: booking.value.participants.map((p) =>
        p.id === updated.id ? updated : p
      ),
    };
  }

  function removeParticipant(id: string): void {
    if (booking.value === null) return;
    booking.value = {
      ...booking.value,
      participants: booking.value.participants.filter((p) => p.id !== id),
    };
  }

  function buildUpdateInput(current: GroupBooking): UpdateBookingInput {
    return {
      groupName: current.groupName,
      externalReference: current.externalReference ?? null,
      notes: current.notes ?? null,
      status: current.status,
      stay: current.stay,
      participants: current.participants,
      assignment: current.assignment,
    };
  }

  async function saveBooking(): Promise<void> {
    if (booking.value === null) return;
    isSaving.value = true;
    saveError.value = null;
    try {
      booking.value = await service.update(booking.value.id, buildUpdateInput(booking.value));
    } catch (err) {
      saveError.value = err instanceof Error ? err.message : "Failed to save booking";
    } finally {
      isSaving.value = false;
    }
  }

  async function confirmBooking(): Promise<void> {
    if (booking.value === null) return;
    if (!validateBookingForConfirmation(booking.value).valid) {
      saveError.value = "Booking has validation errors and cannot be confirmed";
      return;
    }
    isSaving.value = true;
    saveError.value = null;
    try {
      booking.value = await service.update(booking.value.id, {
        ...buildUpdateInput(booking.value),
        status: "confirmed",
      });
    } catch (err) {
      saveError.value = err instanceof Error ? err.message : "Failed to confirm booking";
    } finally {
      isSaving.value = false;
    }
  }

  return {
    booking,
    isLoading,
    isSaving,
    loadError,
    saveError,
    validationResult,
    canConfirm,
    loadBooking,
    createBooking,
    setGroupName,
    setExternalReference,
    setNotes,
    setStay,
    setAssignment,
    addParticipant,
    updateParticipant,
    removeParticipant,
    saveBooking,
    confirmBooking,
  };
}
