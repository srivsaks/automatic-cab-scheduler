// ---- Core domain types ----
// Happy-path only for now: no retries, no cancel windows, no failure branches.
// See README.md for what's deliberately left out and why.

export type RideMode = "auto" | "cab" | "bike";

export interface RideRule {
  id: string;
  userId: string;
  pickup: { lat: number; lng: number; label: string };
  drop: { lat: number; lng: number; label: string };
  targetTime: string; // ISO string, next occurrence
  leadTimeMinutes: number; // how long before targetTime to trigger (default 15)
  modePreference: RideMode;
  status: "active" | "paused";
}

export type TriggerStatus =
  | "pending"
  | "searching"
  | "selected"
  | "initiated"
  | "confirmed"
  | "failed";

export interface TriggerEvent {
  id: string;
  ruleId: string;
  scheduledFireTime: string; // ISO
  status: TriggerStatus;
}

// ---- Beckn transaction shapes (simplified) ----

export interface BecknQuote {
  transactionId: string;
  providerId: "namma-yatri";
  mode: RideMode;
  fare: number;
  etaMinutes: number;
}

export interface BecknOrder {
  transactionId: string;
  orderId: string;
  fare: number;
  driverName: string;
  vehicleNumber: string;
  etaMinutes: number;
}

export interface BecknTransaction {
  transactionId: string;
  triggerId: string;
  state: TriggerStatus;
  quote?: BecknQuote;
  order?: BecknOrder;
}
