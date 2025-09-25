import { DateTime } from "luxon";

/**
 * Helper: format a JS Date (stored in UTC) to user's timezone string.
 */
function formatToUserZone(dateJS, userTz) {
  return DateTime.fromJSDate(dateJS, { zone: "utc" })
    .setZone(userTz)
    .toFormat("d LLLL yyyy 'at' h:mm a");
}

/**
 * Determine classification and representative time for a single task.
 * Returns an object: { labelType, action, timeDT }
 *
 * labelType: 'Pending' | 'Running'
 * action: 'starting' | 'due' | 'not_started_due' | 'overdue'
 * timeDT: Luxon DateTime in UTC (for easy comparison)
 */
function classifyTask(task, nowUtc) {
  const start = DateTime.fromJSDate(task.startAt, { zone: "utc" });
  const end = DateTime.fromJSDate(task.endAt, { zone: "utc" });

  if (task.status === 1) {
    // Pending (not yet started)
    if (start > nowUtc) {
      return { labelType: "Pending", action: "starting", timeDT: start };
    }
    if (start <= nowUtc && end > nowUtc) {
      // start time passed but still not completed -> not started and approaching due time
      return { labelType: "Pending", action: "not_started_due", timeDT: end };
    }
    // start and end both in the past
    return { labelType: "Pending", action: "overdue", timeDT: end };
  }

  // status === 2 -> Running
  if (task.status === 2) {
    if (end > nowUtc) {
      return { labelType: "Running", action: "due", timeDT: end };
    }
    return { labelType: "Running", action: "overdue", timeDT: end };
  }

  // any other status fallback
  return { labelType: "Task", action: "scheduled", timeDT: start };
}

/**
 * Build overview and detailed list HTML for grouped tasks of one user.
 * - tasks: Array of tasks for the user
 * - returns HTML string
 */
export function formatEmailBody(user, tasks, nowUtc) {
  // const nowUtc = DateTime.utc();

  // classify tasks and group by a readable category key
  const groups = new Map(); // key -> { labelType, action, tasks: [], repTimeUtc }
  const detailedItems = []; // For the list items

  for (const task of tasks) {
    const classification = classifyTask(task, nowUtc);
    const key = `${classification.labelType}|${classification.action}`;

    // push task into group
    if (!groups.has(key)) {
      groups.set(key, {
        labelType: classification.labelType,
        action: classification.action,
        tasks: [],
        // representative time we will compute as the earliest upcoming time in the group
        repTimeUtc: classification.timeDT,
      });
    }
    const group = groups.get(key);
    group.tasks.push({ task, classification });

    // keep earliest repTimeUtc (so overview uses the nearest upcoming time)
    if (classification.timeDT < group.repTimeUtc) {
      group.repTimeUtc = classification.timeDT;
    }

    // Prepare the detailed line (converted to user's tz)
    const userTime =
      classification.action === "starting"
        ? formatToUserZone(task.startAt, task.timeZone)
        : formatToUserZone(task.endAt, task.timeZone);

    let detailLabel;
    if (classification.action === "starting") {
      detailLabel = `Starts ${userTime}`;
    } else if (classification.action === "not_started_due") {
      detailLabel = `Not started — due by ${userTime}`;
    } else if (classification.action === "due") {
      detailLabel = `Due by ${userTime}`;
    } else if (classification.action === "overdue") {
      detailLabel = `Overdue (was due ${userTime})`;
    } else {
      detailLabel = `${userTime}`;
    }

    detailedItems.push(
      `<li><strong>${task.title}</strong> — ${detailLabel}</li>`
    );
  }

  // Build overview parts from groups
  const overviewParts = [];
  for (const [key, g] of groups.entries()) {
    const count = g.tasks.length;
    const label = g.labelType; // e.g., 'Pending' or 'Running'

    // choose text based on action
    let actionText;
    if (g.action === "starting") actionText = "starting";
    else if (g.action === "not_started_due" || g.action === "due")
      actionText = "due by";
    else if (g.action === "overdue") actionText = "overdue by";
    else actionText = "scheduled around";

    // convert representative time to user's tz
    const repTimeStr = g.repTimeUtc
      ? g.repTimeUtc
          .setZone(tasks[0].timeZone)
          .toFormat("d LLLL yyyy 'at' h:mm a")
      : "";

    const taskWord = count > 1 ? "tasks" : "task";
    const part = repTimeStr
      ? `${count} ${label} ${taskWord} ${actionText} ${repTimeStr}`
      : `${count} ${label} ${taskWord}`;
    overviewParts.push(part);
  }

  // join overview parts: use commas and 'and' for the last part
  let overview = "";
  if (overviewParts.length === 1) {
    overview = `You have ${overviewParts[0]}.`;
  } else if (overviewParts.length > 1) {
    const last = overviewParts.pop();
    overview = `You have ${overviewParts.join(", ")} and ${last}.`;
  }

  // Build the HTML body
  const tasksListHtml = detailedItems.join("\n");

  const html = `
    <h1>Hello ${user.username},</h1>
    <h2 style="font-family: Arial, sans-serif;">${overview}</h2>
    <p style="font-family: Arial, sans-serif;">Here ${
      tasks.length > 1 ? "are" : "is"
    } your ${tasks.length > 1 ? "tasks" : "task"} summary:
    </p>
    <ul style="font-family: Arial, sans-serif;">
      ${tasksListHtml}
    </ul>
  `;

  return html;
}
