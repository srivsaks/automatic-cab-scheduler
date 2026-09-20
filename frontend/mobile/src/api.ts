import Constants from "expo-constants";
import { RideRule, CreateRuleInput } from "./types";

// Happy path only: no auth headers, no retry, no offline queueing of
// requests made *from* the app (the backend's own offline-resilience is
// separate — see the backend README).
const API_BASE_URL: string =
  (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) ??
  "http://localhost:3000";

export async function createRule(input: CreateRuleInput): Promise<RideRule> {
  const res = await fetch(`${API_BASE_URL}/rules`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Failed to create rule: ${res.status}`);
  return res.json();
}

export async function listRules(): Promise<RideRule[]> {
  const res = await fetch(`${API_BASE_URL}/rules`);
  if (!res.ok) throw new Error(`Failed to list rules: ${res.status}`);
  return res.json();
}
