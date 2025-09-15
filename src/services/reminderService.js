import { prisma } from "../config/dbCofig.js";

export const fetchEligibleTasks = async (currentTime) => {
  const tasks = await prisma.tasks.findMany({
    where: {
      status: { in: [1, 2] },
    //   include: { user: true },
      //   TODO: Filter tasks based on reminder windows
    },
  });
  return tasks;
};
