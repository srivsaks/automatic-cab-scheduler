import { v4 as uuid } from "uuid";
import { RideRule, BecknQuote, BecknOrder } from "../types";

/**
 * Stands in for real calls to the Beckn gateway.
 *
 * In production, `search()` would POST to the gateway and the real
 * `on_search` reply would arrive later on a webhook, correlated by
 * transactionId — not come back as a direct return value like this.
 * This mock collapses that into a simple async call so the orchestrator
 * logic is easy to read and demo. Swap this class for one that makes
 * real HTTP calls + exposes webhook handlers, and the orchestrator
 * below does not need to change — that's the seam this interface is for.
 *
 * Happy path only: always finds a driver, never times out, never surges.
 */
export class MockBecknClient {
  async search(rule: RideRule): Promise<BecknQuote> {
    await delay(200); // pretend network round trip
    return {
      transactionId: uuid(),
      providerId: "namma-yatri",
      mode: rule.modePreference,
      fare: estimateFare(rule),
      etaMinutes: 4,
    };
  }

  async select(quote: BecknQuote): Promise<BecknQuote> {
    await delay(150);
    return quote; // fare locked, unchanged in the happy path
  }

  async init(quote: BecknQuote): Promise<BecknQuote> {
    await delay(150);
    return quote; // payment terms accepted, unchanged in the happy path
  }

  async confirm(quote: BecknQuote): Promise<BecknOrder> {
    await delay(300);
    return {
      transactionId: quote.transactionId,
      orderId: uuid(),
      fare: quote.fare,
      driverName: sample(["Ravi Kumar", "Suresh M", "Ananya R"]),
      vehicleNumber: `KA01 AB ${Math.floor(1000 + Math.random() * 8999)}`,
      etaMinutes: quote.etaMinutes,
    };
  }
}

function estimateFare(rule: RideRule): number {
  const base = { auto: 60, cab: 140, bike: 40 };
  return base[rule.modePreference] + Math.floor(Math.random() * 30);
}

function sample<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
