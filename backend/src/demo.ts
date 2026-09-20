import { v4 as uuid } from "uuid";
import { ruleStore } from "./repo/store";
import { RideRule } from "./types";
import { Scheduler } from "./scheduler";
import { BookingOrchestrator } from "./beckn/orchestrator";
import { MockBecknClient } from "./beckn/mockBecknClient";
import { NotificationService } from "./notification/notificationService";

// Target time is 10 seconds from now, lead time is 5 seconds — so the
// scheduler's next 1-second sweep fires the booking almost immediately.
// In production leadTimeMinutes would be 15 and targetTime would be a
// real future time (e.g. "2026-09-19T09:00:00+05:30").
const targetTime = new Date(Date.now() + 10_000);

const rule: RideRule = {
  id: uuid(),
  userId: "cat-eyes",
  pickup: { lat: 12.9351, lng: 77.6146, label: "Home, Koramangala" },
  drop: { lat: 12.9698, lng: 77.75, label: "Office, Whitefield" },
  targetTime: targetTime.toISOString(),
  leadTimeMinutes: 5 / 60, // 5 seconds, for the demo
  modePreference: "auto",
  status: "active",
};

ruleStore.save(rule);
console.log(`[demo] created rule ${rule.id}, target time ${rule.targetTime}`);

const orchestrator = new BookingOrchestrator(
  new MockBecknClient(),
  new NotificationService()
);
const scheduler = new Scheduler(orchestrator, 1000);
scheduler.start();
