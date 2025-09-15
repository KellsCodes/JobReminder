export const ReminderType = {
  BEFORE_24H: "BEFORE_24H",
  BEFORE_1H: "BEFORE_1H",
  AT_START: "AT_START",
  BEFORE_1H_END: "BEFORE_1H_END",
  AT_END: "AT_END",
};

export function getReminderWindow(currentTime, type) {
  const start = new Date(currentTime);
  const end = new Date(currentTime);

  switch (type) {
    case ReminderType.BEFORE_24H:
      start.setHours(start.getHours() + 23);
      end.setHours(end.getHours() + 24);
      break;
    case ReminderType.BEFORE_1H:
      start.setMinutes(start.getMinutes() + 0);
      end.setHours(end.getHours() + 1);
      break;
    case ReminderType.AT_START:
      start.setMinutes(start.getMinutes() + 0);
      end.setHours(end.getHours() + 1);
      break;
    case ReminderType.BEFORE_1H_END:
      start.setMinutes(start.getMinutes() + 0);
      end.setHours(end.getHours() + 1);
      break;
    case ReminderType.AT_END:
      start.setMinutes(start.getMinutes() + 0);
      end.setHours(end.getHours() + 1);
      break;
    default:
      break;
  }
  return { start, end };
}
