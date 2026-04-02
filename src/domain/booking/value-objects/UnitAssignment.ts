import type { RoomTypeCode } from "../entities/RoomType";

export interface UnitAssignment {
  roomTypeCode: RoomTypeCode | null;
  unitId?: string | null;
  unitLabel?: string | null;
}