import inputFileToArray from "./inputFileToArray";
import Person from "./Person";
import TimeBlock from "./TimeBlock";
import { Heap } from "heap-js";
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

  constructor(filePath: string) {
    const { meetingLength, attendees } = Scheduler.loadScheduleData(filePath);
    this.meetingLength = meetingLength;
    this.attendees = attendees;
  }

  /**
   * Get the list of possible meeting times
   */
  run() {
    return Scheduler.schedule(this.meetingLength, this.attendees);
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
   * @param meetingLength how long the meeting is in minutes
   * @param attendees list of people attending
   * @returns blocks of time which the meeting can occur during
   */
  static schedule(
    meetingLength: number,
    attendees: Array<Person>
  ): Array<TimeBlock> {
    const availMeetings: Array<TimeBlock> = [];

    // store all meetings in a heap;
    const meetings = new Heap<TimeBlock>(TimeBlock.startSort);

    // O(n) Determine the min/max meeting bounds given the attendees' work day.
    const dayBound = Scheduler.getBounds(attendees);

    meetings.add(new TimeBlock("00:00", dayBound.start));
    meetings.add(new TimeBlock(dayBound.end, "24:00"));

    // O(nlog n) Each attendee loop through their meetings and place on heap
    attendees.forEach((a) => a.meetings.forEach((m) => meetings.add(m)));
    let meeting;
    while ((meeting = meetings.pop())) {
      const nextMeeting = meetings.peek();
      if (!nextMeeting) {
        break;
      }

      // if there is overlap, fuse with the next meeting
      if (meeting.end >= nextMeeting.start) {
        nextMeeting.start = meeting.start;
      } else {
        // else there is an opening between now and the next meeting
        // determine if we can schedule there
        if (nextMeeting.start - meeting.end > meetingLength) {
          availMeetings.push(new TimeBlock(meeting.end, nextMeeting.start));
        }
      }
    }
    return availMeetings;
  }
}
