import { describe, it, expect, vi, beforeEach } from "vitest";
import { useGroupBookingEditor } from "../useGroupBookingEditor";
import type { BookingService } from "@/services/booking/BookingService";
import type { GroupBooking } from "@/domain/booking/entities/GroupBooking";
import type { Participant } from "@/domain/booking/entities/Participant";

// ---------------------------------------------------------------------------
// Factories
// ---------------------------------------------------------------------------

function makeBooking(overrides: Partial<GroupBooking> = {}): GroupBooking {
  return {
    id: "b-1",
    groupName: "Team Alpha",
    externalReference: null,
    status: "draft",
    stay: { checkIn: "2026-06-01", checkOut: "2026-06-05" },
    participants: [],
    assignment: { roomTypeCode: "double", unitId: null, unitLabel: null },
    notes: null,
    createdAt: "2026-04-14T10:00:00.000Z",
    updatedAt: "2026-04-14T10:00:00.000Z",
    ...overrides,
  };
}

function makeParticipant(overrides: Partial<Participant> = {}): Participant {
  return {
    id: "p-1",
    firstName: "Ana",
    lastName: "Silva",
    email: "ana@example.com",
    isPrimaryContact: false,
    ...overrides,
  };
}

function makeValidBooking(): GroupBooking {
  return makeBooking({
    participants: [makeParticipant({ isPrimaryContact: true })],
  });
}

// ---------------------------------------------------------------------------
// Fake service
// ---------------------------------------------------------------------------

function makeFakeService(): BookingService {
  return {
    list: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  };
}

// ---------------------------------------------------------------------------
// loadBooking
// ---------------------------------------------------------------------------

describe("useGroupBookingEditor — loadBooking", () => {
  it("sets booking when the service resolves", async () => {
    const service = makeFakeService();
    const booking = makeBooking();
    vi.mocked(service.getById).mockResolvedValue(booking);

    const editor = useGroupBookingEditor(service);
    await editor.loadBooking("b-1");

    expect(editor.booking.value).toEqual(booking);
    expect(editor.loadError.value).toBeNull();
  });

  it("sets loadError when the service returns null", async () => {
    const service = makeFakeService();
    vi.mocked(service.getById).mockResolvedValue(null);

    const editor = useGroupBookingEditor(service);
    await editor.loadBooking("missing-id");

    expect(editor.booking.value).toBeNull();
    expect(editor.loadError.value).toMatch("missing-id");
  });

  it("sets loadError when the service rejects", async () => {
    const service = makeFakeService();
    vi.mocked(service.getById).mockRejectedValue(new Error("Network failure"));

    const editor = useGroupBookingEditor(service);
    await editor.loadBooking("b-1");

    expect(editor.booking.value).toBeNull();
    expect(editor.loadError.value).toBe("Network failure");
  });
});

// ---------------------------------------------------------------------------
// createBooking
// ---------------------------------------------------------------------------

describe("useGroupBookingEditor — createBooking", () => {
  it("sets booking from the service return value", async () => {
    const service = makeFakeService();
    const booking = makeBooking({ groupName: "New Group" });
    vi.mocked(service.create).mockResolvedValue(booking);

    const editor = useGroupBookingEditor(service);
    await editor.createBooking({ groupName: "New Group" });

    expect(editor.booking.value?.groupName).toBe("New Group");
  });

  it("sets loadError when the service rejects", async () => {
    const service = makeFakeService();
    vi.mocked(service.create).mockRejectedValue(new Error("Create failed"));

    const editor = useGroupBookingEditor(service);
    await editor.createBooking({ groupName: "Any" });

    expect(editor.booking.value).toBeNull();
    expect(editor.loadError.value).toBe("Create failed");
  });
});

// ---------------------------------------------------------------------------
// saveBooking
// ---------------------------------------------------------------------------

describe("useGroupBookingEditor — saveBooking", () => {
  it("calls service.update with current booking state", async () => {
    const service = makeFakeService();
    const booking = makeBooking();
    vi.mocked(service.getById).mockResolvedValue(booking);
    vi.mocked(service.update).mockResolvedValue(booking);

    const editor = useGroupBookingEditor(service);
    await editor.loadBooking("b-1");
    await editor.saveBooking();

    expect(service.update).toHaveBeenCalledWith("b-1", expect.objectContaining({
      groupName: "Team Alpha",
      status: "draft",
    }));
  });

  it("updates booking from the service return value", async () => {
    const service = makeFakeService();
    const original = makeBooking();
    const saved = makeBooking({ groupName: "Saved Name" });
    vi.mocked(service.getById).mockResolvedValue(original);
    vi.mocked(service.update).mockResolvedValue(saved);

    const editor = useGroupBookingEditor(service);
    await editor.loadBooking("b-1");
    await editor.saveBooking();

    expect(editor.booking.value?.groupName).toBe("Saved Name");
  });

  it("sets saveError when the service rejects", async () => {
    const service = makeFakeService();
    vi.mocked(service.getById).mockResolvedValue(makeBooking());
    vi.mocked(service.update).mockRejectedValue(new Error("Save failed"));

    const editor = useGroupBookingEditor(service);
    await editor.loadBooking("b-1");
    await editor.saveBooking();

    expect(editor.saveError.value).toBe("Save failed");
  });

  it("does nothing when no booking is loaded", async () => {
    const service = makeFakeService();

    const editor = useGroupBookingEditor(service);
    await editor.saveBooking();

    expect(service.update).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// confirmBooking
// ---------------------------------------------------------------------------

describe("useGroupBookingEditor — confirmBooking", () => {
  it("does not call service.update when validation fails", async () => {
    const service = makeFakeService();
    // Booking with no participants — validation will fail
    vi.mocked(service.getById).mockResolvedValue(makeBooking({ participants: [] }));

    const editor = useGroupBookingEditor(service);
    await editor.loadBooking("b-1");
    await editor.confirmBooking();

    expect(service.update).not.toHaveBeenCalled();
  });

  it("sets saveError when validation fails", async () => {
    const service = makeFakeService();
    vi.mocked(service.getById).mockResolvedValue(makeBooking({ participants: [] }));

    const editor = useGroupBookingEditor(service);
    await editor.loadBooking("b-1");
    await editor.confirmBooking();

    expect(editor.saveError.value).toBeTruthy();
  });

  it("calls service.update with status confirmed when validation passes", async () => {
    const service = makeFakeService();
    const booking = makeValidBooking();
    vi.mocked(service.getById).mockResolvedValue(booking);
    vi.mocked(service.update).mockResolvedValue({ ...booking, status: "confirmed" });

    const editor = useGroupBookingEditor(service);
    await editor.loadBooking("b-1");
    await editor.confirmBooking();

    expect(service.update).toHaveBeenCalledWith("b-1", expect.objectContaining({
      status: "confirmed",
    }));
  });

  it("sets booking to confirmed after successful confirmation", async () => {
    const service = makeFakeService();
    const booking = makeValidBooking();
    vi.mocked(service.getById).mockResolvedValue(booking);
    vi.mocked(service.update).mockResolvedValue({ ...booking, status: "confirmed" });

    const editor = useGroupBookingEditor(service);
    await editor.loadBooking("b-1");
    await editor.confirmBooking();

    expect(editor.booking.value?.status).toBe("confirmed");
  });
});

// ---------------------------------------------------------------------------
// Participant primary contact orchestration
// ---------------------------------------------------------------------------

describe("useGroupBookingEditor — participant primary contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("addParticipant: demotes existing primary when new participant is added as primary", async () => {
    const service = makeFakeService();
    const existingPrimary = makeParticipant({ id: "p-1", isPrimaryContact: true });
    vi.mocked(service.getById).mockResolvedValue(makeBooking({ participants: [existingPrimary] }));

    const editor = useGroupBookingEditor(service);
    await editor.loadBooking("b-1");
    editor.addParticipant(makeParticipant({ id: "p-2", isPrimaryContact: true }));

    const participants = editor.booking.value?.participants ?? [];
    expect(participants.find((p) => p.id === "p-1")?.isPrimaryContact).toBe(false);
    expect(participants.find((p) => p.id === "p-2")?.isPrimaryContact).toBe(true);
  });

  it("addParticipant: does not affect existing primary when new participant is not primary", async () => {
    const service = makeFakeService();
    const existingPrimary = makeParticipant({ id: "p-1", isPrimaryContact: true });
    vi.mocked(service.getById).mockResolvedValue(makeBooking({ participants: [existingPrimary] }));

    const editor = useGroupBookingEditor(service);
    await editor.loadBooking("b-1");
    editor.addParticipant(makeParticipant({ id: "p-2", isPrimaryContact: false }));

    const participants = editor.booking.value?.participants ?? [];
    expect(participants.find((p) => p.id === "p-1")?.isPrimaryContact).toBe(true);
  });

  it("updateParticipant: demotes other primaries when a participant is updated to primary", async () => {
    const service = makeFakeService();
    const p1 = makeParticipant({ id: "p-1", isPrimaryContact: true });
    const p2 = makeParticipant({ id: "p-2", isPrimaryContact: false });
    vi.mocked(service.getById).mockResolvedValue(makeBooking({ participants: [p1, p2] }));

    const editor = useGroupBookingEditor(service);
    await editor.loadBooking("b-1");
    editor.updateParticipant({ ...p2, isPrimaryContact: true });

    const participants = editor.booking.value?.participants ?? [];
    expect(participants.find((p) => p.id === "p-1")?.isPrimaryContact).toBe(false);
    expect(participants.find((p) => p.id === "p-2")?.isPrimaryContact).toBe(true);
  });

  it("setPrimaryContact: promotes the target and demotes all others", async () => {
    const service = makeFakeService();
    const p1 = makeParticipant({ id: "p-1", isPrimaryContact: true });
    const p2 = makeParticipant({ id: "p-2", isPrimaryContact: false });
    const p3 = makeParticipant({ id: "p-3", isPrimaryContact: false });
    vi.mocked(service.getById).mockResolvedValue(makeBooking({ participants: [p1, p2, p3] }));

    const editor = useGroupBookingEditor(service);
    await editor.loadBooking("b-1");
    editor.setPrimaryContact("p-3");

    const participants = editor.booking.value?.participants ?? [];
    expect(participants.find((p) => p.id === "p-1")?.isPrimaryContact).toBe(false);
    expect(participants.find((p) => p.id === "p-2")?.isPrimaryContact).toBe(false);
    expect(participants.find((p) => p.id === "p-3")?.isPrimaryContact).toBe(true);
  });
});
