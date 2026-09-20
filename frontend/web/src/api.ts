import { RideRule, CreateRuleInput } from "./types";

// Happy path only: no auth headers, no error-shape parsing beyond ok/not-ok.
const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
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
