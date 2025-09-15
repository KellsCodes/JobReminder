import { prisma } from "../config/dbCofig.js";
import { getReminderWindow, ReminderType } from "../utils/reminderUtils.js";

export const fetchEligibleTasks = async (currentTime) => {
  const eligibleTasks = [];

  // Loop through each reminder type
  for (const type of Object.values(ReminderType)) {
    const { start, end } = getReminderWindow(currentTime);
    const tasks = await prisma.tasks.findMany({
      where: {
        status: { in: [1, 2] },
        OR: [
          {
            startAt: { gte: start, lte: end },
            endAt: { gte: start, lte: end },
          },
        ],
        ReminderLog: {
          none: { ReminderType: type },
        },
      },
      include: {
        user: true,
      },
    });

    // Attach reminder type to each task
    tasks.forEach((t) => (t.ReminderType = type));
    eligibleTasks.push(...tasks);
  }

  return eligibleTasks
};
