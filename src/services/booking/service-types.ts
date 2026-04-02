import type { BookingStatus } from "@/domain/booking/value-objects/BookingStatus";
import type { StayDateRange } from "@/domain/booking/value-objects/StayDateRange";
import type { UnitAssignment } from "@/domain/booking/value-objects/UnitAssignment";
import type { Participant } from "@/domain/booking/entities/Participant";

export interface CreateBookingInput {
  groupName: string;
  externalReference?: string;
  notes?: string;
}

export interface UpdateBookingInput {
  groupName: string;
  externalReference: string | null;
  notes: string | null;
  status: BookingStatus;
  stay: StayDateRange;
  participants: Participant[];
  assignment: UnitAssignment;
}
