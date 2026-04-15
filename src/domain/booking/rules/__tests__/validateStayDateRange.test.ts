import { describe, it, expect } from "vitest";
import { validateStayDateRange } from "../validateStayDateRange";

describe("validateStayDateRange", () => {
  it("passes when checkOut is after checkIn", () => {
    const result = validateStayDateRange({ checkIn: "2026-06-01", checkOut: "2026-06-05" });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("fails when checkIn is missing", () => {
    const result = validateStayDateRange({ checkIn: "", checkOut: "2026-06-05" });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: "stay.checkIn" })
    );
  });

  it("fails when checkOut is missing", () => {
    const result = validateStayDateRange({ checkIn: "2026-06-01", checkOut: "" });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: "stay.checkOut" })
    );
  });

  it("produces two errors when both dates are missing", () => {
    const result = validateStayDateRange({ checkIn: "", checkOut: "" });

    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(2);
  });

  it("fails when checkOut equals checkIn", () => {
    const result = validateStayDateRange({ checkIn: "2026-06-01", checkOut: "2026-06-01" });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: "stay.checkOut" })
    );
  });

  it("fails when checkOut is before checkIn", () => {
    const result = validateStayDateRange({ checkIn: "2026-06-05", checkOut: "2026-06-01" });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: "stay.checkOut" })
    );
  });
});
