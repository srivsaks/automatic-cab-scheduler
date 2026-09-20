import { RideRule, TriggerEvent, BecknTransaction } from "../types";

// In-memory stand-ins for Postgres tables.
// Swap these for real repositories (pg / prisma / etc.) without touching
// any of the code that calls them — that's the whole point of the interface.

class Store<T extends { id: string }> {
  private items = new Map<string, T>();

  save(item: T): T {
    this.items.set(item.id, item);
    return item;
  }

  get(id: string): T | undefined {
    return this.items.get(id);
  }

  all(): T[] {
    return Array.from(this.items.values());
  }
}

export const ruleStore = new Store<RideRule>();
export const triggerStore = new Store<TriggerEvent>();

// Transactions are keyed by transactionId, not a generic "id" field,
// so this one gets its own tiny store rather than reusing Store<T>.
class TransactionStore {
  private items = new Map<string, BecknTransaction>();

  save(tx: BecknTransaction): BecknTransaction {
    this.items.set(tx.transactionId, tx);
    return tx;
  }

  get(transactionId: string): BecknTransaction | undefined {
    return this.items.get(transactionId);
  }
}

export const transactionStore = new TransactionStore();
