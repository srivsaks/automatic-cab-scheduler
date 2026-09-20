import { ruleStore, triggerStore } from "./repo/store";
import { BookingOrchestrator, newTriggerFor } from "./beckn/orchestrator";

/**
 * Sweeps active rules every `intervalMs` and fires any whose trigger time
 * (targetTime - leadTimeMinutes) has arrived. A real deployment would use
 * a delayed job queue (e.g. BullMQ) instead of polling, but the shape is
 * the same: this sweep never runs on the user's phone, only on the server,
 * which is why the booking doesn't depend on the phone being online.
 *
 * Happy path only: fires each rule once and marks it paused so the demo
 * doesn't loop forever. No handling for recurrence or missed sweeps.
 */
export class Scheduler {
  private firedRuleIds = new Set<string>();

  constructor(
    private orchestrator: BookingOrchestrator,
    private intervalMs: number = 5000
  ) {}

  start() {
    setInterval(() => this.sweep(), this.intervalMs);
    console.log(`[scheduler] running, sweeping every ${this.intervalMs}ms`);
  }

  private sweep() {
    const now = Date.now();

    for (const rule of ruleStore.all()) {
      if (rule.status !== "active" || this.firedRuleIds.has(rule.id)) continue;

      const target = new Date(rule.targetTime).getTime();
      const fireAt = target - rule.leadTimeMinutes * 60 * 1000;

      if (now >= fireAt) {
        this.firedRuleIds.add(rule.id);
        const trigger = newTriggerFor(rule, new Date(fireAt));
        triggerStore.save(trigger);
        console.log(
          `[scheduler] firing trigger ${trigger.id} for rule ${rule.id}`
        );
        this.orchestrator.run(rule, trigger).catch((err) =>
          console.error(`[scheduler] trigger ${trigger.id} failed:`, err)
        );
      }
    }
  }
}
