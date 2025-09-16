import { prisma } from "../config/dbCofig.js";
import { getReminderWindow, ReminderType } from "../utils/reminderUtils.js";

export const fetchEligibleTasks = async (currentTime) => {
  const userTaskMap = new Map();

  // Loop through each reminder type
  for (const type of Object.values(ReminderType)) {
    const { start, end } = getReminderWindow(currentTime, type);
    const tasks = await prisma.tasks.findMany({
      where: {
        status: { in: [1, 2] },
        OR: [
          {
            startAt: { gte: start, lte: end },
            endAt: { gte: start, lte: end },
          },
        ],
        reminderLogs: {
          none: { reminderType: type },
        },
      },
      include: {
        user: true,
      },
    });

    // Group tasks by user
    tasks.forEach((task) => {
      const userId = task.userId;
      if (!userTaskMap.has(userId)) {
        userTaskMap.set(userId, []);
      }
      // Attach reminderType for later use
      task.reminderType = type;
      userTaskMap.get(userId).push(task);
    });
  }
  // return user mapped task Map<userId, Tasks[]>
  return userTaskMap;
};
