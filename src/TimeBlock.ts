import TimePoint from "./TimePoint";

/**
 * A TimeBlock holds a start and end time (TimePoint).
 */
export default class TimeBlock {
  start_tp: TimePoint;
  end_tp: TimePoint;

  constructor(start: TimeBlock | string | number, end?: string | number) {
    if (start instanceof TimeBlock) {
      this.start_tp = start.start_tp;
      this.end_tp = start.end_tp;
    } else if (end != null) {
      this.start_tp = new TimePoint(start);
      this.end_tp = new TimePoint(end);
    } else {
      throw "Invalid initialize call";
    }
  }
  get start() {
    return this.start_tp.time;
  }
  get end() {
    return this.end_tp.time;
  }
  toString(): string {
    return `${this.start_tp.toString()} - ${this.end_tp.toString()}`;
  }
}
