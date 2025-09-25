export const ReminderType = {
  BEFORE_24H: "BEFORE_24H", // 24 hours before start
  BEFORE_1H: "BEFORE_1H", // 1 hour before start
  AT_START: "AT_START", // exactly at event start
  BEFORE_1H_END: "BEFORE_1H_END", // 1 hour before end
  AT_END: "AT_END", // exactly at event end
};

export function getReminderWindow(startTime, endTime, type) {
  let start, end;

  switch (type) {
    case ReminderType.BEFORE_24H:
      // window: between 24h and 23h before event start
      start = new Date(startTime);
      start.setHours(start.getHours() - 24);
      end = new Date(startTime);
      end.setHours(end.getHours() - 23);
      break;

    case ReminderType.BEFORE_1H:
      // window: 1h before event start
      start = new Date(startTime);
      start.setHours(start.getHours() - 1);
      end = new Date(startTime);
      break;

    case ReminderType.AT_START:
      // window: event start time → 10 minute after
      start = new Date(startTime);
      end = new Date(startTime);
      end.setMinutes(end.getMinutes() + 10);
      break;

    case ReminderType.BEFORE_1H_END:
      // window: 1h before event end → event end
      start = new Date(endTime);
      start.setHours(start.getHours() - 1);
      end = new Date(endTime);
      break;

    case ReminderType.AT_END:
      // window: event end → 1 minute after
      start = new Date(endTime);
      end = new Date(endTime);
      end.setMinutes(end.getMinutes() + 1);
      break;

    default:
      throw new Error(`Unknown reminder type: ${type}`);
  }

  return { start, end };
}
