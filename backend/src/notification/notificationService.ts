import { BecknQuote, BecknOrder, RideRule } from "../types";

/**
 * Stands in for a real FCM push. Swap the body of these methods for an
 * actual FCM call later — callers never need to change.
 */
export class NotificationService {
  aboutToBook(rule: RideRule, quote: BecknQuote) {
    this.log(
      rule.userId,
      `About to book your ${quote.mode} to ${rule.drop.label} — fare ₹${quote.fare}`
    );
  }

  booked(rule: RideRule, order: BecknOrder) {
    this.log(
      rule.userId,
      `Booked! ${order.driverName} (${order.vehicleNumber}) is ${order.etaMinutes} min away — ₹${order.fare}`
    );
  }

  private log(userId: string, message: string) {
    // eslint-disable-next-line no-console
    console.log(`[push -> user:${userId}] ${message}`);
  }
}
