import express from "express";
import { ruleRoutes } from "./api/ruleRoutes";
import { Scheduler } from "./scheduler";
import { BookingOrchestrator } from "./beckn/orchestrator";
import { MockBecknClient } from "./beckn/mockBecknClient";
import { NotificationService } from "./notification/notificationService";

const app = express();
app.use(express.json());
app.use(ruleRoutes);

const orchestrator = new BookingOrchestrator(
  new MockBecknClient(),
  new NotificationService()
);
const scheduler = new Scheduler(orchestrator, 5000);
scheduler.start();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
  console.log(`[server] POST /rules to create a ride rule`);
});
