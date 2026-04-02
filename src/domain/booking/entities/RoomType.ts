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