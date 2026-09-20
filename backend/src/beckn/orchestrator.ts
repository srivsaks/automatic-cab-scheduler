import { v4 as uuid } from "uuid";
import { RideRule, TriggerEvent, BecknTransaction } from "../types";
import { MockBecknClient } from "./mockBecknClient";
import { NotificationService } from "../notification/notificationService";
import { transactionStore, triggerStore } from "../repo/store";

/**
 * Drives a single trigger through search -> select -> init -> confirm.
 *
 * Happy path only: no cancel window, no timeouts, no idempotency guards,
 * no retries. Every one of those is a real requirement for production —
 * see README.md — but they're left out here so the core sequence reads
 * clearly. Add them as guard clauses around each step below.
 */
export class BookingOrchestrator {
  constructor(
    private becknClient: MockBecknClient,
    private notifications: NotificationService
  ) {}

  async run(rule: RideRule, trigger: TriggerEvent): Promise<void> {
    trigger.status = "searching";
    triggerStore.save(trigger);

    // search -> on_search
    const quote = await this.becknClient.search(rule);
    let tx: BecknTransaction = {
      transactionId: quote.transactionId,
      triggerId: trigger.id,
      state: "selected",
      quote,
    };
    transactionStore.save(tx);

    // select -> on_select
    await this.becknClient.select(quote);
    trigger.status = "selected";
    triggerStore.save(trigger);

    // This is where a real cancel window would sit, timed against
    // rule.leadTimeMinutes. Skipped here — happy path proceeds straight
    // through to booking.
    this.notifications.aboutToBook(rule, quote);

    // init -> on_init
    await this.becknClient.init(quote);
    trigger.status = "initiated";
    triggerStore.save(trigger);
    tx = { ...tx, state: "initiated" };
    transactionStore.save(tx);

    // confirm -> on_confirm
    const order = await this.becknClient.confirm(quote);
    trigger.status = "confirmed";
    triggerStore.save(trigger);
    tx = { ...tx, state: "confirmed", order };
    transactionStore.save(tx);

    this.notifications.booked(rule, order);
  }
}

export function newTriggerFor(rule: RideRule, scheduledFireTime: Date): TriggerEvent {
  return {
    id: uuid(),
    ruleId: rule.id,
    scheduledFireTime: scheduledFireTime.toISOString(),
    status: "pending",
  };
}
