import { useEffect, useState } from "react";
import { RideRule } from "./types";
import { listRules } from "./api";
import { RuleForm } from "./RuleForm";
import { RuleList } from "./RuleList";
import "./index.css";

// Works as both mweb and dweb — no separate build, the CSS handles the
// layout difference at different widths. See index.css.
export function App() {
  const [rules, setRules] = useState<RideRule[]>([]);

  async function refresh() {
    try {
      setRules(await listRules());
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="app">
      <h1>Auto Ride Scheduler</h1>
      <RuleForm onCreated={refresh} />
      <RuleList rules={rules} />
    </div>
  );
}
