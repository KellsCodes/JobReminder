import { prisma } from "../config/dbCofig.js";
import { ReminderType } from "../utils/reminderUtils.js";

export const getTasksForReminder = async (currentTime) => {
  const userTaskMap = new Map();
  const reminderLogQueue = [];

  const timeDrift = {
    before: currentTime.minus({ minutes: 20 }),
    after: currentTime.plus({ minutes: 5 }),
  };
  const starts24h = currentTime.plus({ hours: 24 });
  const starts1h = currentTime.plus({ hours: 1 });
  const end1hBefore = currentTime.plus({ hours: 1 });
  // Run query to get the tasks to schedule
  const reminders = await prisma.tasks.findMany({
    where: {
      OR: [
        // pending task and start time approximately 24hours from now
        {
          status: 1,
          startAt: {
            gte: starts24h.minus({ minutes: 20 }).toJSDate(),
            lte: starts24h.plus({ minutes: 5 }).toJSDate(),
          },
        },
        // pending task and start time approximately 1 hour from now
        {
          status: 1,
          startAt: {
            gte: starts1h.minus({ minutes: 20 }).toJSDate(),
            lte: starts1h.plus({ minutes: 5 }).toJSDate(),
          },
        },
        // pending task and start time is approximately now
        {
          status: 1,
          startAt: {
            gte: timeDrift.before.toJSDate(),
            lte: timeDrift.after.toJSDate(),
          },
        },
        // pending or running task and approximately 1 hour before task end time
        {
          status: { in: [1, 2] },
          endAt: {
            gte: end1hBefore.minus({ minutes: 20 }).toJSDate(),
            lte: end1hBefore.plus({ minutes: 5 }).toJSDate(),
          },
        },
        // pending or running task and end time is approximately current time
        {
          status: { in: [1, 2] },
          endAt: {
            gte: timeDrift.before.toJSDate(),
            lte: timeDrift.after.toJSDate(),
          },
        },
      ],
    },
    include: {
      user: {
        select: {
          email: true,
          username: true,
          profile: {
            select: { firstname: true, lastname: true },
          },
        },
      },
    },
  });

  // Group tasks by user, this will enable sending grouped notification to single email and not overwhelming user inbox
  reminders.forEach((task) => {
    const userId = task.userId;
    if (!userTaskMap.has(userId)) {
      userTaskMap.set(userId, []);
    }
    userTaskMap.get(userId).push(task);

    /**
     * Attach reminderType for logging 
     */
    // case 1: when the start time is 24hours away
    if (
      task.startAt >= starts24h.minus({ minutes: 20 }).toJSDate() &&
      task.startAt <= starts24h.plus({ minutes: 5 }).toJSDate()
    ) {
      reminderLogQueue.push({
        taskId: task.id,
        reminderType: ReminderType.BEFORE_24H,
        sentAt: new Date(),
      });
    }
    // case 2: when the start time is 1 hour away
    if (
      task.startAt >= starts1h.minus({ minutes: 20 }).toJSDate() &&
      task.startAt <= starts1h.plus({ minutes: 5 }).toJSDate()
    ) {
      reminderLogQueue.push({
        taskId: task.id,
        reminderType: ReminderType.BEFORE_1H,
        sentAt: new Date(),
      });
    }
    // case 3: when the start time is now
    if (
      task.startAt >= timeDrift.before.toJSDate() &&
      task.startAt <= timeDrift.after.toJSDate()
    ) {
      reminderLogQueue.push({
        taskId: task.id,
        reminderType: ReminderType.AT_START,
        sentAt: new Date(),
      });
    }
    // case 4: when the end time is 1 hour away
    if (
      task.endAt >= end1hBefore.minus({ minutes: 20 }).toJSDate() &&
      task.endAt <= end1hBefore.plus({ minutes: 5 }).toJSDate()
    ) {
      reminderLogQueue.push({
        taskId: task.id,
        reminderType: ReminderType.BEFORE_1H_END,
        sentAt: new Date(),
      });
    }
    // case 5: when the end time is now
    if (
      task.endAt >= timeDrift.before.toJSDate() &&
      task.endAt <= timeDrift.after.toJSDate()
    ) {
      reminderLogQueue.push({
        taskId: task.id,
        reminderType: ReminderType.AT_END,
        sentAt: new Date(),
      });
    }
  });
  // return user mapped task Map<userId, Tasks[]> and reminderLoqQueue[]
  return [userTaskMap, reminderLogQueue];
};
