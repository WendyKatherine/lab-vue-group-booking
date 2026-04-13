export type RoomTypeCode =
  | "single"
  | "double"
  | "suite"
  | "family";

export interface RoomType {
  code: RoomTypeCode;
  defaultName: string;
  maxOccupancy: number;
  isActive: boolean;
}

export const ROOM_TYPES: RoomType[] = [
  { code: 'single', defaultName: 'Single', maxOccupancy: 1, isActive: true },
  { code: 'double', defaultName: 'Double', maxOccupancy: 2, isActive: true },
  { code: 'suite',  defaultName: 'Suite',  maxOccupancy: 4, isActive: true },
  { code: 'family', defaultName: 'Family', maxOccupancy: 6, isActive: true },
]