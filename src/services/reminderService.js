import { prisma } from "../config/dbCofig.js";
import { getReminderWindow, ReminderType } from "../utils/reminderUtils.js";
import { sendEmail } from "../utils/emailUtils.js"
import { formatEmailBody } from "./emailService.js";

/**
 * Send reminders for a map of user -> tasks.
 * After sending successfully, log each reminder in ReminderLog.
 */
export async function sendRemindersForUsers(userTaskMap, reminderType) {
  for (const [userId, tasks] of userTaskMap.entries()) {
    if (!tasks.length) continue;

    const user = tasks[0].user; // all tasks belong to the same user
    const emailHtml = formatEmailBody(user, tasks);

    try {
      // Send the email
      await sendEmail({
        to: user.email,
        subject: "Task Reminder Notification",
        html: emailHtml,
      });

      // Log the sent reminders
      await prisma.reminderLog.createMany({
        data: tasks.map((task) => ({
          taskId: task.id,
          reminderType,
          sentAt: new Date(),
        })),
        skipDuplicates: true, // ensure we don't double-log
      });

      console.log(
        `Reminder sent to ${user.email} for ${tasks.length} task(s).`
      );
    } catch (err) {
      console.error(`Failed to send reminder to ${user.email}:`, err);
    }
  }
}
