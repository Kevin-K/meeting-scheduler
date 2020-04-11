import inputFileToArray from "./inputFileToArray";
import Person from "./Person";
import TimeBlock from "./TimeBlock";
import { cloneDeep } from "lodash";
export type ScheduleData = {
  meetingLength: number;
  attendees: Array<Person>;
};

/**
 * The Scheduler encapsulates the functionality of:
 * 1. reading in a schedule text file (on initialization)
 * 2. determining a list of possible meeting times
 *
 * This class retains the attendee's schedule. It does not
 * add the meeting to their schedule at this point in time.
 *
 * The intention of this being an instantiated class is to grow
 * the capabilities to compute complex scheduling operations in the future.
 */
export class Scheduler {
  meetingLength: number;
  attendees: Array<Person>;
  schedulingInterval: number = 15;

  constructor(filePath: string) {
    const { meetingLength, attendees } = Scheduler.loadScheduleData(filePath);
    this.meetingLength = meetingLength;
    this.attendees = attendees;
  }

  /**
   * Get the list of possible meeting times
   */
  run() {
    return Scheduler.schedule(
      this.meetingLength,
      this.attendees,
      this.schedulingInterval
    );
  }

  /**
   * Loads a given schedule text file.
   * See <project root>/schedule.txt for format.
   * @param filePath The path to the schedule data file
   */
  static loadScheduleData(filePath: string): ScheduleData {
    const inputs = inputFileToArray(filePath);
    const scheduleData: ScheduleData = {
      meetingLength: Number.parseInt(inputs.shift() as string),
      attendees: [],
    };

    while (inputs.length) {
      let meetings, workDay: Array<string | number>;
      const schedule: string = inputs.shift() as string;
      const day: string = inputs.shift() as string;
      if (!schedule || !day) {
        continue;
      }
      try {
        meetings = JSON.parse(schedule);
        workDay = JSON.parse(day);
      } catch (e) {
        console.error(
          `Could not process attendee:\n\tmeetings: ${schedule}\n\twork day: ${day}`
        );
        continue;
      }
      scheduleData.attendees.push(new Person(meetings, workDay));
    }
    return scheduleData;
  }

  /**
   * Given a list of attendee's, determine the window
   * of overlap for their work days.
   * @param attendees Array of people
   */
  static getBounds(attendees: Array<Person>): TimeBlock {
    const timeBlock = new TimeBlock(0, 2400);
    attendees.forEach((a) => {
      const { workDay } = a;
      if (workDay.start > timeBlock.start)
        timeBlock.start_tp = workDay.start_tp;
      if (workDay.end < timeBlock.end) timeBlock.end_tp = workDay.end_tp;
    });
    return timeBlock;
  }

  /**
   * Given a meeting length and a list of attendees,
   * find all possible meeting times during the work day.
   * The suggestionInterval puts a N minute gap between each suggestion. Default 15 minutes.
   * @param meetingLength how long the meeting is in minutes
   * @param attendees list of people attending
   * @param suggestionInterval how many minutes apart to make suggestions.
   */
  static schedule(
    meetingLength: number,
    attendees: Array<Person>,
    suggestionInterval = 15
  ): Array<TimeBlock> {
    const availMeetings = [];
    // Determine the min/max meeting bounds given the attendees' work day.
    const dayBound = Scheduler.getBounds(attendees);

    console.log(`from: ${dayBound.start_tp.time} to: ${dayBound.end_tp.time}`);
    // Look to schedule starting at the min work day bound, and end at the end
    // work day bound less the meeting time.
    let nextAvailabeTime = dayBound.start;
    const latestMeetingPossible = dayBound.end - meetingLength;

    // get a working set of attendees (cloned meeting schedules since JS
    // is passing a reference)
    const attendeeData = attendees.map(cloneDeep);

    // loop through until the last possible meeting.
    while (nextAvailabeTime <= latestMeetingPossible) {
      let found = true;

      // loop through each attendee
      // if the attendee can't make the current time in test, move
      // the reference point to their next free slot (if further in the
      // future than time in test)
      attendeeData.forEach((attendee, i) => {
        let meeting;

        // fast foward through the attendee's schedule until
        // the next meeting after the time point in reference
        do {
          meeting = attendee.meetings.shift();
        } while (meeting && meeting.start < nextAvailabeTime);
        if (!meeting) return;

        // if the meeting won't fit before this attendee's next meeting,
        // then move to looking at after their meeting.
        if (nextAvailabeTime + meetingLength > meeting.start) {
          nextAvailabeTime = meeting.end;
          found = false;
        }
      });

      // If a meeting time was found, add it to the list and bump to the next
      // suggested interval.
      if (found) {
        availMeetings.push(
          new TimeBlock(nextAvailabeTime, nextAvailabeTime + meetingLength)
        );
        nextAvailabeTime = nextAvailabeTime + suggestionInterval;
      }
    }

    return availMeetings;
  }
}
