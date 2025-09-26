import dotenv from "dotenv";
dotenv.config();
import { sendRemindersForUsers } from "./services/reminderService.js";
import { DateTime } from "luxon";
import { getTasksForReminder } from "./services/taskService.js";
import { connectDB } from "./config/dbCofig.js";

/**
 * 1. Get the current time and convert to UTC time*
 * 2. Run the following query:
 *    a. if current time + 24hours is equal to startTime of a task and the status is pending, retrieve it
 *    b. if the current time + 1 hour is equal to startTime and the status is pending, retrieve it
 *    c. if the current time is equal to the startTime and status is pending, retrieve it
 *    d. if the current time + 1 hour is equal to endTime and the status is pending or running, retrieve it
 *    e. if the current time is equal to the startTime and the current time is pending or running, retrieve it
 * 3. Group the retrieved tasks according to user id; use object map
 * 4. loop through the user ids, prepare email message according to the number of task for the user
 * 5. Prepare the sent notification to be sent, according to the time window, push them all into an array of objects
 * 5. send the enail out to the users
 * 6. log to the logreminder after notification for each task sent to users from the array of objects; the save method is skip duplicates.
 */
async function main() {
  // const currentTime = DateTime.utc();
  const isoString = "2025-09-24T17:00:00.000Z";
  const currentTime = DateTime.fromISO(isoString, {
    zone: "utc",
  });
  await connectDB();
  const [userTaskMap, reminderLogQueue] = await getTasksForReminder(
    currentTime
  );
  if (userTaskMap.size === 0) {
    console.log("No tasks to remind at the currentTime:", currentTime.toISO());
  } else {
    await sendRemindersForUsers(userTaskMap, currentTime, reminderLogQueue);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => process.exit(0));
