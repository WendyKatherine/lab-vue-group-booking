# CLAUDE.md

## Project Overview
This repository is a technical demo called `lab-vue-group-booking`.

The goal is to demonstrate:
- group booking creation and editing
- participant management
- stay date handling
- room type / unit assignment
- draft vs confirmed booking state
- clear validation rules
- clean separation between domain, services, and UI
- compatibility with a future .NET backend

This is NOT a full production reservation system.
It is a portfolio-grade engineering demo focused on domain clarity, state handling, validation, and clean frontend architecture.

---

## Scope
### In scope (v1)
- create a group booking
- edit an existing group booking
- manage participants
- assign a room type
- optionally assign a unit label
- manage stay dates
- change booking status between `draft` and `confirmed`
- validate required fields and booking rules
- show a live booking summary
- persist data through local mock services

### Out of scope (v1)
- payments
- authentication
- emails
- calendar sync
- real room availability
- pricing
- real database
- backend API implementation
- external APIs

---

## Architecture Style
Use a lightweight layered architecture adapted to Vue 3:

- `src/domain/booking` → business concepts, entities, value objects, rules
- `src/services` → mock service layer and future API-compatible service contracts
- `src/composables` → page/application state orchestration for booking flows
- `src/components` → UI components
- `src/pages` → route-level screens
- `docs` → domain model, requirements, and design decisions

Avoid overengineering.
Do not introduce unnecessary abstractions, factories, or patterns unless they clearly improve clarity.

---

## Coding Principles
- Prefer TypeScript everywhere
- Keep business concepts framework-agnostic
- Do not mix domain model with DTOs or UI-only state
- Prefer explicit types and small functions
- Favor readability over cleverness
- Keep validation rules deterministic
- Keep UI components thin when possible
- Use composables for orchestration, not for domain definition
- Do not put persistence details inside UI components
- Preserve a structure that can later connect to a real .NET backend without a full refactor

---

## Domain Model Guidance
The core aggregate is `GroupBooking`.

Current domain concepts:
- Entities:
  - `GroupBooking`
  - `Participant`
  - `RoomType`
- Value objects:
  - `BookingStatus`
  - `StayDateRange`
  - `UnitAssignment`

Guidelines:
- `GroupBooking` is the aggregate root
- `Participant` belongs to a booking and is not a global shared entity in v1
- `RoomType` is a domain catalog entity
- `BookingStatus` is part of the domain, not just UI state
- `StayDateRange` stores dates only; derived values like duration should be calculated, not persisted in v1
- `UnitAssignment` may reference a room type and optionally a concrete unit later

---

## Domain Rules
- A booking may exist in `draft` state with partial data
- A booking in `confirmed` state must satisfy required validation rules
- `checkOut` must be later than `checkIn`
- A confirmed booking must have at least one participant
- A confirmed booking must have one selected room type
- A booking should have one primary contact
- Frontend validation should reflect domain rules clearly
- Mock persistence should simulate a backend contract, not leak storage details into UI

---

## Service Layer Guidance
For v1, use mock/local services only.

Service design should:
- mimic future backend interaction
- return typed data
- remain replaceable by a future HTTP implementation
- keep storage concerns out of components

Prefer a structure where:
- service contracts are stable
- mock implementation can later be replaced by a real API service
- domain types are not tightly coupled to storage format

---

## Testing Expectations
Use Vitest later if needed.

Write tests for:
- booking validation rules
- date range validation
- participant management rules
- booking status transitions if implemented
- mapping logic if DTOs are introduced

Prefer test-alongside implementation for domain logic.

---

## Implementation Guidance
When generating code:
- do not add random libraries
- do not invent unsupported business rules
- do not add backend code unless explicitly requested
- do not add Pinia unless there is a clear reason
- do not move files unless necessary
- do not replace union types with loose strings
- keep imports clean
- keep modules small and focused
- prefer incremental changes over large rewrites

---

## Communication Style
When proposing code:
- explain the intention briefly
- keep implementation practical
- prefer incremental changes
- avoid rewriting unrelated files
- stay consistent with the current domain structure