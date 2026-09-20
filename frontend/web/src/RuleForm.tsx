import { useState } from "react";
import { CreateRuleInput, RideMode } from "./types";
import { createRule } from "./api";

interface Props {
  onCreated: () => void;
}

// Happy path only: no validation beyond "required", no error display beyond
// a console log. See README.md for what to add before this is real.
export function RuleForm({ onCreated }: Props) {
  const [pickupLabel, setPickupLabel] = useState("Home");
  const [dropLabel, setDropLabel] = useState("Office");
  const [targetTime, setTargetTime] = useState("");
  const [leadTimeMinutes, setLeadTimeMinutes] = useState(15);
  const [modePreference, setModePreference] = useState<RideMode>("auto");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const input: CreateRuleInput = {
        userId: "cat-eyes", // hardcoded until auth exists
        pickup: { lat: 12.9351, lng: 77.6146, label: pickupLabel },
        drop: { lat: 12.9698, lng: 77.75, label: dropLabel },
        targetTime: new Date(targetTime).toISOString(),
        leadTimeMinutes,
        modePreference,
      };
      await createRule(input);
      onCreated();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="rule-form" onSubmit={handleSubmit}>
      <h2>New ride rule</h2>

      <label>
        Pickup
        <input
          value={pickupLabel}
          onChange={(e) => setPickupLabel(e.target.value)}
          required
        />
      </label>

      <label>
        Drop
        <input
          value={dropLabel}
          onChange={(e) => setDropLabel(e.target.value)}
          required
        />
      </label>

      <label>
        Target time
        <input
          type="datetime-local"
          value={targetTime}
          onChange={(e) => setTargetTime(e.target.value)}
          required
        />
      </label>

      <label>
        Lead time (minutes before)
        <input
          type="number"
          min={1}
          value={leadTimeMinutes}
          onChange={(e) => setLeadTimeMinutes(Number(e.target.value))}
        />
      </label>

      <label>
        Mode
        <select
          value={modePreference}
          onChange={(e) => setModePreference(e.target.value as RideMode)}
        >
          <option value="auto">Auto</option>
          <option value="cab">Cab</option>
          <option value="bike">Bike</option>
        </select>
      </label>

      <button type="submit" disabled={submitting}>
        {submitting ? "Creating..." : "Create rule"}
      </button>
    </form>
  );
}
