# Namma Yatri auto-booking — happy path scaffold

This is the structure from our design conversation, wired up and runnable,
covering only the **happy path**: a driver is always found, payment always
goes through, nothing times out or fails.

## Run it

```bash
npm install
npm run demo     # creates a rule 10s in the future and watches it fire
# or
npm start        # starts the HTTP API on :3000, POST /rules to create one
```

`npm run demo` is the fastest way to see the whole thing work end to end —
it doesn't wait 15 real minutes, the rule fires within a few seconds.

## What's here

- `src/types.ts` — the core domain types (RideRule, TriggerEvent, BecknTransaction)
- `src/repo/store.ts` — in-memory repositories. Swap for real Postgres queries later; nothing else needs to change.
- `src/beckn/mockBecknClient.ts` — stands in for the real Beckn gateway calls (search/select/init/confirm). Swap for real HTTP calls to the Beckn gateway + real webhook handlers for on_search/on_select/on_init/on_confirm — the orchestrator doesn't need to change.
- `src/beckn/orchestrator.ts` — drives one trigger through the full Beckn sequence
- `src/scheduler.ts` — sweeps for rules due to fire. Polling here; swap for BullMQ + Redis for production.
- `src/notification/notificationService.ts` — logs to console instead of sending real push. Swap for FCM.
- `src/api/ruleRoutes.ts` + `src/server.ts` — the HTTP API for creating rules

## Deliberately NOT here yet — from our edge-case discussion

- Cancel window before `confirm`
- Timeouts when `on_search` never comes back (no driver nearby)
- Idempotency guards against a job firing twice
- Retry/backoff on any Beckn call failure
- Surge fare threshold handling
- Driver-cancels-after-assignment handling
- Recurrence (a rule firing once currently pauses itself)
- Auth on the API
- Real payment method validation at rule-creation time

Each of these is a guard clause or a small module around the existing
structure, not a rewrite — the seams (BecknClient interface, orchestrator
state checks, store interface) are there specifically so they can be added
incrementally without touching everything else.
