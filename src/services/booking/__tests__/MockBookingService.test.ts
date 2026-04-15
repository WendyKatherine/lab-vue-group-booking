import { describe, it, expect, beforeEach, vi } from "vitest";
import { MockBookingService } from "../MockBookingService";
import type { UpdateBookingInput } from "../service-types";

// ---------------------------------------------------------------------------
// localStorage stub
// ---------------------------------------------------------------------------

function createStorageMock(): Storage {
  const store = new Map<string, string>();
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => { store.set(key, value); },
    removeItem: (key) => { store.delete(key); },
    clear: () => { store.clear(); },
    get length() { return store.size; },
    key: (index) => [...store.keys()][index] ?? null,
  };
}

beforeEach(() => {
  vi.stubGlobal("localStorage", createStorageMock());
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeUpdateInput(overrides: Partial<UpdateBookingInput> = {}): UpdateBookingInput {
  return {
    groupName: "Team Alpha",
    externalReference: null,
    notes: null,
    status: "draft",
    stay: { checkIn: "2026-06-01", checkOut: "2026-06-05" },
    participants: [],
    assignment: { roomTypeCode: "double", unitId: null, unitLabel: null },
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// list
// ---------------------------------------------------------------------------

describe("MockBookingService.list", () => {
  it("returns an empty array when no bookings exist", async () => {
    const service = new MockBookingService();

    const result = await service.list();

    expect(result).toEqual([]);
  });

  it("returns all created bookings", async () => {
    const service = new MockBookingService();
    await service.create({ groupName: "Group A" });
    await service.create({ groupName: "Group B" });

    const result = await service.list();

    expect(result).toHaveLength(2);
    expect(result.map((b) => b.groupName)).toEqual(
      expect.arrayContaining(["Group A", "Group B"])
    );
  });
});

// ---------------------------------------------------------------------------
// getById
// ---------------------------------------------------------------------------

describe("MockBookingService.getById", () => {
  it("returns the booking when the id exists", async () => {
    const service = new MockBookingService();
    const created = await service.create({ groupName: "Team Alpha" });

    const result = await service.getById(created.id);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(created.id);
  });

  it("returns null when the id does not exist", async () => {
    const service = new MockBookingService();

    const result = await service.getById("nonexistent-id");

    expect(result).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// create
// ---------------------------------------------------------------------------

describe("MockBookingService.create", () => {
  it("returns a booking with the provided groupName", async () => {
    const service = new MockBookingService();

    const result = await service.create({ groupName: "Conference 2026" });

    expect(result.groupName).toBe("Conference 2026");
  });

  it("sets status to draft", async () => {
    const service = new MockBookingService();

    const result = await service.create({ groupName: "Any Group" });

    expect(result.status).toBe("draft");
  });

  it("assigns a non-empty id", async () => {
    const service = new MockBookingService();

    const result = await service.create({ groupName: "Any Group" });

    expect(result.id).toBeTruthy();
  });

  it("persists the booking so getById returns it", async () => {
    const service = new MockBookingService();
    const created = await service.create({ groupName: "Persistent Group" });

    const fetched = await service.getById(created.id);

    expect(fetched?.groupName).toBe("Persistent Group");
  });

  it("assigns distinct ids to separate bookings", async () => {
    const service = new MockBookingService();
    const a = await service.create({ groupName: "A" });
    const b = await service.create({ groupName: "B" });

    expect(a.id).not.toBe(b.id);
  });
});

// ---------------------------------------------------------------------------
// update
// ---------------------------------------------------------------------------

describe("MockBookingService.update", () => {
  it("returns the booking with updated fields", async () => {
    const service = new MockBookingService();
    const created = await service.create({ groupName: "Original" });

    const result = await service.update(
      created.id,
      makeUpdateInput({ groupName: "Updated", status: "confirmed" })
    );

    expect(result.groupName).toBe("Updated");
    expect(result.status).toBe("confirmed");
  });

  it("persists the update so getById reflects the change", async () => {
    const service = new MockBookingService();
    const created = await service.create({ groupName: "Before" });

    await service.update(created.id, makeUpdateInput({ groupName: "After" }));
    const fetched = await service.getById(created.id);

    expect(fetched?.groupName).toBe("After");
  });

  it("does not affect other bookings", async () => {
    const service = new MockBookingService();
    const a = await service.create({ groupName: "Group A" });
    const b = await service.create({ groupName: "Group B" });

    await service.update(a.id, makeUpdateInput({ groupName: "Group A updated" }));
    const fetchedB = await service.getById(b.id);

    expect(fetchedB?.groupName).toBe("Group B");
  });

  it("throws when the booking id does not exist", async () => {
    const service = new MockBookingService();

    await expect(
      service.update("nonexistent-id", makeUpdateInput())
    ).rejects.toThrow("nonexistent-id");
  });
});
