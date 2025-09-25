import { prisma } from "../config/dbCofig.js";

export const getTasksForReminder = async (currentTime) => {
  const userTaskMap = new Map();
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
    // Attach reminderType for later use
    // task.reminderType = type;
    userTaskMap.get(userId).push(task);
  });
  // return user mapped task Map<userId, Tasks[]>
  return userTaskMap;
};
