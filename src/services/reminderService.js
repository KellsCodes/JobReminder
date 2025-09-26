import { prisma } from "../config/dbCofig.js";
import { ReminderType } from "../utils/reminderUtils.js";
import { sendEmail } from "../utils/emailUtils.js";
import { formatEmailBody } from "./emailService.js";

/**
 * Send reminders for a map of user -> tasks.
 * After sending successfully, log each reminder in ReminderLog.
 */
export async function sendRemindersForUsers(
  userTaskMap,
  currentTime,
  reminderLogQueue
) {
  const messageQueue = [];
  for (const [userId, tasks] of userTaskMap.entries()) {
    const user = tasks[0].user; // all tasks belong to the same user
    const emailHtml = formatEmailBody(user, tasks, currentTime.toJSDate());
    const subject = `Your Task${tasks.length > 1 ? "s" : ""} Reminder`;
    messageQueue.push(sendEmail(user.email, subject, emailHtml));
  }
  // console.log(reminderLogQueue);
  // return;
  // Send email to users
  const results = await Promise.allSettled(messageQueue);
  results.forEach((result, i) => {
    if (result.status === "fulfilled") {
      console.log(`Email ${i + 1} sent successfully`);
    } else {
      console.error(`Email ${i + 1} failed:`, result.reason);
    }
  });
  // Log reminder to database
  try {
    await prisma.reminderLog.createMany({
      data: reminderLogQueue,
      skipDuplicates: true,
    });
  } catch (error) {
    // log the error for failure here
    console.error(error);
  }
}
