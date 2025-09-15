import dotenv from "dotenv";
dotenv.config();
import { fetchEligibleTasks } from "./services/reminderService.js";

async function main() {
  const currentTime = new Date();

  console.log("JobReminder running at:", currentTime);

  const tasksByUser = await fetchEligibleTasks(currentTime);
  for (const [userId, tasks] of tasksByUser.entries()) {
    console.log(
      `User: ${tasks[0].user.email}, Tasks: ${tasks.map((task) => task.title)}`
    );
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => process.exit());
