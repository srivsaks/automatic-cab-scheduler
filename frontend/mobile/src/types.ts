// Mirrors backend/src/types.ts (RideRule) and web/src/types.ts — kept in
// sync by hand for now across all three. Worth lifting into a shared
// package once the duplication starts to hurt.

export type RideMode = "auto" | "cab" | "bike";

export interface RideRule {
  id: string;
  userId: string;
  pickup: { lat: number; lng: number; label: string };
  drop: { lat: number; lng: number; label: string };
  targetTime: string;
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
