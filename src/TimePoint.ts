/**
 * A class for managing the time format of this exercise.
 * Time is read in from the input file as "HH:MM" (24 hour). This class
 * handles validation of the input, and stores the time as integer minutes.
 *
 * Provides static utilities for validation and format conversion.
 */
export default class TimePoint {
  time: number;
  constructor(point: string | number) {
    this.time =
      typeof point == "number"
        ? Math.floor(point)
        : TimePoint.timeStrToNum(point);
    if (!TimePoint.isValidTime(this.time)) {
      throw `Invalid time: ${point} became ${this.time}.\nValid format is: 1) Integer 0 to 2400 or String "00:00" to "24:00"`;
    }
  }

  static timeStrToNum(time: string): number {
    const [hours, minutes] = time.split(":");
    return Number.parseInt(hours) * 60 + Number.parseInt(minutes);
  }

  static isValidTime(time: number): boolean {
    return time >= 0 && time <= 2400 && time % 1 == 0;
  }

  toString(): string {
    const hours = Math.floor(this.time / 60);
    const minutes = this.time % 60;
    const strMinutes = (minutes < 10 ? "0" : "") + minutes;
    return `${hours}:${strMinutes}`;
  }
}
