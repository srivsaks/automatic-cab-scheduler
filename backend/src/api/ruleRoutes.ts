import { Router } from "express";
import { v4 as uuid } from "uuid";
import { ruleStore } from "../repo/store";
import { RideRule } from "../types";

export const ruleRoutes = Router();

// POST /rules - create a ride rule
ruleRoutes.post("/rules", (req, res) => {
  const { userId, pickup, drop, targetTime, leadTimeMinutes, modePreference } =
    req.body;

  if (!userId || !pickup || !drop || !targetTime || !modePreference) {
    return res.status(400).json({ error: "missing required fields" });
  }

  const rule: RideRule = {
    id: uuid(),
    userId,
    pickup,
    drop,
    targetTime,
    leadTimeMinutes: leadTimeMinutes ?? 15,
    modePreference,
    status: "active",
  };

  ruleStore.save(rule);
  res.status(201).json(rule);
});

// GET /rules - list all rules (happy path: no auth, no per-user filter)
ruleRoutes.get("/rules", (_req, res) => {
  res.json(ruleStore.all());
});
