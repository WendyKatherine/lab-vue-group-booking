import { describe, it, expect } from "vitest";
import { createGroupBooking } from "../createGroupBooking";

const BASE_INPUT = {
  id: "booking-1",
  createdAt: "2026-04-14T10:00:00.000Z",
  updatedAt: "2026-04-14T10:00:00.000Z",
};

describe("createGroupBooking", () => {
  it("passes through id, createdAt, and updatedAt", () => {
    const booking = createGroupBooking(BASE_INPUT);

    expect(booking.id).toBe("booking-1");
    expect(booking.createdAt).toBe("2026-04-14T10:00:00.000Z");
    expect(booking.updatedAt).toBe("2026-04-14T10:00:00.000Z");
  });

  it("sets status to draft", () => {
    const booking = createGroupBooking(BASE_INPUT);

    expect(booking.status).toBe("draft");
  });

  it("defaults groupName to empty string when omitted", () => {
    const booking = createGroupBooking(BASE_INPUT);

    expect(booking.groupName).toBe("");
  });

  it("uses provided groupName when given", () => {
    const booking = createGroupBooking({ ...BASE_INPUT, groupName: "Team Alpha" });

    expect(booking.groupName).toBe("Team Alpha");
  });

  it("defaults externalReference to null when omitted", () => {
    const booking = createGroupBooking(BASE_INPUT);

    expect(booking.externalReference).toBeNull();
  });

  it("defaults notes to null when omitted", () => {
    const booking = createGroupBooking(BASE_INPUT);

    expect(booking.notes).toBeNull();
  });

  it("starts with empty participants list", () => {
    const booking = createGroupBooking(BASE_INPUT);

    expect(booking.participants).toEqual([]);
  });

  it("starts with empty stay dates", () => {
    const booking = createGroupBooking(BASE_INPUT);

    expect(booking.stay).toEqual({ checkIn: "", checkOut: "" });
  });

  it("starts with no room type or unit assigned", () => {
    const booking = createGroupBooking(BASE_INPUT);

    expect(booking.assignment).toEqual({
      roomTypeCode: null,
      unitId: null,
      unitLabel: null,
    });
  });
});
