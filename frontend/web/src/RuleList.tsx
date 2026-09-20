import { RideRule } from "./types";

interface Props {
  rules: RideRule[];
}

export function RuleList({ rules }: Props) {
  if (rules.length === 0) {
    return <p className="empty">No rules yet — create one above.</p>;
  }

  return (
    <ul className="rule-list">
      {rules.map((rule) => (
        <li key={rule.id} className="rule-card">
          <div className="rule-route">
            {rule.pickup.label} → {rule.drop.label}
          </div>
          <div className="rule-meta">
            {new Date(rule.targetTime).toLocaleString()} · {rule.modePreference} ·{" "}
            {rule.status}
          </div>
        </li>
      ))}
    </ul>
  );
}
