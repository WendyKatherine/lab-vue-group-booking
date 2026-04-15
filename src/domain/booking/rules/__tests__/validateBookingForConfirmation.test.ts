import { describe, it, expect } from "vitest";
import { validateBookingForConfirmation } from "../validateBookingForConfirmation";
import type { GroupBooking } from "../../entities/GroupBooking";
import type { Participant } from "../../entities/Participant";

function makeParticipant(overrides: Partial<Participant> = {}): Participant {
  return {
    id: "p-1",
    firstName: "Ana",
    lastName: "Silva",
    email: "ana@example.com",
    isPrimaryContact: true,
    ...overrides,
  };
}

function makeValidBooking(overrides: Partial<GroupBooking> = {}): GroupBooking {
  return {
    id: "b-1",
    groupName: "Team Alpha",
    externalReference: null,
    status: "draft",
    stay: { checkIn: "2026-06-01", checkOut: "2026-06-05" },
    participants: [makeParticipant()],
    assignment: { roomTypeCode: "double", unitId: null, unitLabel: null },
    notes: null,
    createdAt: "2026-04-14T10:00:00.000Z",
    updatedAt: "2026-04-14T10:00:00.000Z",
    ...overrides,
  };
}

describe("validateBookingForConfirmation", () => {
  it("passes when all required fields are present and valid", () => {
    const result = validateBookingForConfirmation(makeValidBooking());

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("fails when groupName is blank", () => {
    const result = validateBookingForConfirmation(makeValidBooking({ groupName: "   " }));

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: "groupName" })
    );
  });

  it("fails when stay dates are invalid", () => {
    const result = validateBookingForConfirmation(
      makeValidBooking({ stay: { checkIn: "2026-06-05", checkOut: "2026-06-01" } })
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: "stay.checkOut" })
    );
  });

  it("fails when there are no participants", () => {
    const result = validateBookingForConfirmation(makeValidBooking({ participants: [] }));

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: "participants" })
    );
  });

  it("fails when no participant is marked as primary contact", () => {
    const result = validateBookingForConfirmation(
      makeValidBooking({
        participants: [makeParticipant({ isPrimaryContact: false })],
      })
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: "participants", message: expect.stringContaining("primary contact") })
    );
  });

  it("fails when more than one participant is marked as primary contact", () => {
    const result = validateBookingForConfirmation(
      makeValidBooking({
        participants: [
          makeParticipant({ id: "p-1", isPrimaryContact: true }),
          makeParticipant({ id: "p-2", isPrimaryContact: true }),
        ],
      })
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: "participants", message: expect.stringContaining("Only one") })
    );
  });

  it("fails when no room type is selected", () => {
    const result = validateBookingForConfirmation(
      makeValidBooking({ assignment: { roomTypeCode: null, unitId: null, unitLabel: null } })
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: "assignment.roomTypeCode" })
    );
  });

  it("accumulates multiple independent validation errors", () => {
    const result = validateBookingForConfirmation(
      makeValidBooking({
        groupName: "",
        participants: [],
        assignment: { roomTypeCode: null, unitId: null, unitLabel: null },
      })
    );

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(3);
  });
});
