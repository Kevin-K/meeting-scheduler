import { Scheduler } from "./src/schedule";
import { printHelp } from "./src/help";
/**
 * Read in arguments
 */
// Ensure arguments are correct
if (process.argv.length < 3) {
  console.error("Invalid arguments.");
  printHelp();
  process.exit(0);
}
const [, , inputFile] = process.argv;
let schedule;
try {
  schedule = new Scheduler(inputFile);
} catch (e) {
  if (e.code === "ENOENT") {
    console.error(e.message);
  }
}

if (schedule) {
  // Print file read data first for visibility
  schedule.attendees.forEach((a, i) => {
    console.log(`Person #${i}:`);
    console.log(`\tWork Day:\t${a.workDay}`);
    console.log(
      `\tCalendar:\t${a.meetings
        .map((m) => `${m.start_tp.time} - ${m.end_tp.time}`)
        .join(", ")}`
    );
  });

  const results = schedule.run();
  console.log(
    "---------------------------------------------------------------"
  );
  console.log("Meeting Schedule Results:");
  console.log(`\tMeeting Length:\t${schedule.meetingLength}`);
  console.log(`\tTime Slots:\t${results.join(", ")}`);
}
