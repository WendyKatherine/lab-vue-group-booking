import type { GroupBooking } from "@/domain/booking/entities/GroupBooking";
import { createGroupBooking } from "@/domain/booking/defaults/createGroupBooking";
import type { BookingService } from "./BookingService";
import type { CreateBookingInput, UpdateBookingInput } from "./service-types";

const STORAGE_KEY = "lab:group-bookings";

function loadAll(): GroupBooking[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) return [];
  try {
    return JSON.parse(raw) as GroupBooking[];
  } catch {
    return [];
  }
}

function saveAll(bookings: GroupBooking[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export class MockBookingService implements BookingService {
  async list(): Promise<GroupBooking[]> {
    return loadAll();
  }

  async getById(id: string): Promise<GroupBooking | null> {
    return loadAll().find(b => b.id === id) ?? null;
  }

  async create(input: CreateBookingInput): Promise<GroupBooking> {
    const now = new Date().toISOString();
    const booking = createGroupBooking({
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      groupName: input.groupName,
      externalReference: input.externalReference,
      notes: input.notes,
    });
    saveAll([...loadAll(), booking]);
    return booking;
  }

  async update(id: string, input: UpdateBookingInput): Promise<GroupBooking> {
    const all = loadAll();
    const existing = all.find(b => b.id === id);
    if (!existing) throw new Error(`Booking not found: ${id}`);

    const updated: GroupBooking = {
      ...existing,
      groupName: input.groupName,
      externalReference: input.externalReference,
      notes: input.notes,
      status: input.status,
      stay: input.stay,
      participants: input.participants,
      assignment: input.assignment,
      updatedAt: new Date().toISOString(),
    };

    saveAll(all.map(b => (b.id === id ? updated : b)));
    return updated;
  }
}
