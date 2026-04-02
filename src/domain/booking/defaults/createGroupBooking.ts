import type { GroupBooking } from "../entities/GroupBooking";

export interface CreateGroupBookingInput {
  id: string;
  createdAt: string;
  updatedAt: string;
  groupName?: string;
  externalReference?: string | null;
  notes?: string | null;
}

export function createGroupBooking(input: CreateGroupBookingInput): GroupBooking {
  return {
    id: input.id,
    groupName: input.groupName ?? "",
    externalReference: input.externalReference ?? null,
    status: "draft",
    stay: { checkIn: "", checkOut: "" },
    participants: [],
    assignment: { roomTypeCode: null, unitId: null, unitLabel: null },
    notes: input.notes ?? null,
    createdAt: input.createdAt,
    updatedAt: input.updatedAt,
  };
}
