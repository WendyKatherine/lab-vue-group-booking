```mermaid
classDiagram
  class GroupBooking {
    +string id
    +string groupName
    +string externalReference
    +BookingStatus status
    +StayDateRange stay
    +UnitAssignment assignment
    +Participant[] participants
    +string notes
    +string createdAt
    +string updatedAt
  }

  class Participant {
    +string id
    +string firstName
    +string lastName
    +string email
    +boolean isPrimaryContact
  }

  class RoomType {
    +RoomTypeCode code
    +string defaultName
    +number maxOccupancy
    +boolean isActive
  }

  class StayDateRange {
    +string checkIn
    +string checkOut
  }

  class UnitAssignment {
    +RoomTypeCode roomTypeCode
    +string unitId
    +string unitLabel
  }

  class BookingStatus {
    <<enumeration>>
    draft
    confirmed
  }

  class RoomTypeCode {
    <<enumeration>>
    single
    double
    suite
    family
  }

  GroupBooking "1" *-- "many" Participant : contains
  GroupBooking "1" *-- "1" StayDateRange : has
  GroupBooking "1" *-- "1" UnitAssignment : has
  UnitAssignment --> RoomTypeCode : references
  RoomType --> RoomTypeCode : uses
  GroupBooking --> BookingStatus : status