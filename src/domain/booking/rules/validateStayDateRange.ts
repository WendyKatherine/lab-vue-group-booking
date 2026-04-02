import type { StayDateRange } from "../value-objects/StayDateRange";
import type { ValidationError, ValidationResult } from "../ValidationResult";

export function validateStayDateRange(stay: StayDateRange): ValidationResult {
  const errors: ValidationError[] = [];

  if (!stay.checkIn) {
    errors.push({ field: "stay.checkIn", message: "Check-in date is required" });
  }

  if (!stay.checkOut) {
    errors.push({ field: "stay.checkOut", message: "Check-out date is required" });
  }

  if (stay.checkIn && stay.checkOut && stay.checkOut <= stay.checkIn) {
    errors.push({ field: "stay.checkOut", message: "Check-out must be after check-in" });
  }

  return { valid: errors.length === 0, errors };
}
