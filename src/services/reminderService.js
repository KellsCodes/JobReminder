import { prisma } from "../config/dbCofig.js";
import { ReminderType } from "../utils/reminderUtils.js";
import { sendEmail } from "../utils/emailUtils.js";
import { formatEmailBody } from "./emailService.js";

/**
 * Send reminders for a map of user -> tasks.
 * After sending successfully, log each reminder in ReminderLog.
 */
export async function sendRemindersForUsers(userTaskMap, currentTime) {
  // console.log(userTaskMap, currentTime.toJSDate());
  const messageQueue = [];
  const reminderLogQueue = [];
  for (const [userId, tasks] of userTaskMap.entries()) {
    const user = tasks[0].user; // all tasks belong to the same user
    const emailHtml = formatEmailBody(user, tasks, currentTime.toJSDate());
    // console.log({ [userId]: emailHtml });
    console.log(emailHtml);
    messageQueue.push(
      sendEmail({
        to: user.email,
        subject: `Your Task${tasks.length > 1 ? "s" : ""} Reminder`,
        html: emailHtml,
      })
    );

    // try {
    //   // Send the email
    //   await sendEmail({
    //     to: user.email,
    //     subject: "Task Reminder Notification",
    //     html: emailHtml,
    //   });

    //   // Log the sent reminders
    //   await prisma.reminderLog.createMany({
    //     data: tasks.map((task) => ({
    //       taskId: task.id,
    //       reminderType,
    //       sentAt: new Date(),
    //     })),
    //     skipDuplicates: true, // ensure we don't double-log
    //   });

    //   console.log(
    //     `Reminder sent to ${user.email} for ${tasks.length} task(s).`
    //   );
    // } catch (err) {
    //   console.error(`Failed to send reminder to ${user.email}:`, err);
    // }
  }

  const results = await Promise.allSettled(messageQueue);
  results.forEach((result, i) => {
    if (result.status === "fulfilled") {
      console.log(`Email ${i + 1} sent successfully`);
    } else {
      console.error(`Email ${i + 1} failed:`, result.reason);
    }
  });
}
