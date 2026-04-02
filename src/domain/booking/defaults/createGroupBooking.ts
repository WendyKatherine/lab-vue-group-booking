import type { GroupBooking } from "../entities/GroupBooking";

// Not a pure function — generates a unique id and captures the current timestamp.
// Pass overrides.id and overrides.createdAt for deterministic behavior in tests.
export function createGroupBooking(overrides?: Partial<GroupBooking>): GroupBooking {
  const now = new Date().toISOString();

  const defaults: GroupBooking = {
    id: crypto.randomUUID(),
    groupName: "",
    externalReference: null,
    status: "draft",
    stay: {
      checkIn: "",
      checkOut: "",
    },
    participants: [],
    assignment: {
      roomTypeCode: null,
      unitId: null,
      unitLabel: null,
    },
    notes: null,
    createdAt: now,
    updatedAt: now,
  };

  return {
    ...defaults,
    ...overrides,
    stay: { ...defaults.stay, ...overrides?.stay },
    assignment: { ...defaults.assignment, ...overrides?.assignment },
  };
}
