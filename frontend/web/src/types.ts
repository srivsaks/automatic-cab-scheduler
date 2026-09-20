// Mirrors backend/src/types.ts (RideRule) — kept in sync by hand for now.
// Worth lifting into a shared package once both clients exist and this
// duplication starts to hurt.

export type RideMode = "auto" | "cab" | "bike";

export interface RideRule {
  id: string;
  userId: string;
  pickup: { lat: number; lng: number; label: string };
  drop: { lat: number; lng: number; label: string };
  targetTime: string; // ISO string
  leadTimeMinutes: number;
  modePreference: RideMode;
  status: "active" | "paused";
}

export interface CreateRuleInput {
  userId: string;
  pickup: { lat: number; lng: number; label: string };
  drop: { lat: number; lng: number; label: string };
  targetTime: string;
  leadTimeMinutes?: number;
  modePreference: RideMode;
}
