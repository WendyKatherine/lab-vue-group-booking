import type { GroupBooking } from "@/domain/booking/entities/GroupBooking";
import type { CreateBookingInput, UpdateBookingInput } from "./service-types";

export interface BookingService {
  getById(id: string): Promise<GroupBooking | null>;
  create(input: CreateBookingInput): Promise<GroupBooking>;
  update(id: string, input: UpdateBookingInput): Promise<GroupBooking>;
}
