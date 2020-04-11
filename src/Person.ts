import TimeBlock from "./TimeBlock";
import { cloneDeep } from "lodash";

/**
 * A person is someone with a work data time range (TimeBlock)
 * and a list of meetings for the day (TimeBlocks).
 */
export default class Person {
  meetings: Array<TimeBlock>;
  workDay: TimeBlock;
  constructor(
    meetings: Array<TimeBlock | Array<number | string>>,
    workDay: TimeBlock | Array<number | string>
  ) {
    // loop over meetings, handles an array of Timeblock and array of array notation.
    // TimeBlocks are held by reference.
    this.meetings = meetings.map((m) =>
      Array.isArray(m) ? new TimeBlock(m[0], m[1]) : m
    );
    this.workDay = Array.isArray(workDay)
      ? new TimeBlock(workDay[0], workDay[1])
      : workDay;
  }
}
