import type { BookingStatus } from "../value-objects/BookingStatus";
import type { Participant } from "./Participant";
import type { StayDateRange } from "../value-objects/StayDateRange";
import type { UnitAssignment } from "../value-objects/UnitAssignment";

export interface GroupBooking {
  id: string;
  groupName: string;
  externalReference?: string | null;
  status: BookingStatus;
  stay: StayDateRange;
  participants: Participant[];
  assignment: UnitAssignment;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}