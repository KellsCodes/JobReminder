import dotenv from "dotenv";
dotenv.config();
import { fetchEligibleTasks } from "./services/reminderService.js";

async function main() {
  const currentTime = new Date();

  console.log("JobReminder running at:", currentTime);

  const tasks = await fetchEligibleTasks(currentTime);
  console.log("Eligible tasks for reminders:", tasks);
}

main()
  .catch((e) => console.error(e))
  .finally(() => process.exit());
