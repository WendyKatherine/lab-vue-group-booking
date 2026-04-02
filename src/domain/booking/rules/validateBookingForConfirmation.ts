import type { GroupBooking } from "../entities/GroupBooking";
import type { ValidationError, ValidationResult } from "./ValidationResult";
import { validateStayDateRange } from "./validateStayDateRange";

export function validateBookingForConfirmation(booking: GroupBooking): ValidationResult {
  const errors: ValidationError[] = [];

  if (!booking.groupName.trim()) {
    errors.push({ field: "groupName", message: "Group name is required" });
  }

  const stayResult = validateStayDateRange(booking.stay);
  errors.push(...stayResult.errors);

  if (booking.participants.length === 0) {
    errors.push({ field: "participants", message: "At least one participant is required" });
  }

  const primaryCount = booking.participants.filter(p => p.isPrimaryContact).length;
  if (primaryCount === 0) {
    errors.push({ field: "participants", message: "One participant must be the primary contact" });
  } else if (primaryCount > 1) {
    errors.push({ field: "participants", message: "Only one participant can be the primary contact" });
  }

  if (booking.assignment.roomTypeCode === null) {
    errors.push({ field: "assignment.roomTypeCode", message: "A room type must be selected" });
  }

  return { valid: errors.length === 0, errors };
}
