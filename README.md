# Meeting Scheduler

An implementation of a meeting scheduler in TypeScript.

## Install

```
npm i
```

## Run

```
npm start -- <filename>
```

ex: `npm start -- ./schedule.txt`

## Schedule document format

```
<length of meeting>
# Then as many of the following
<Array of meeting time tuples for individual>
<Work day tuple for individual>
```

Ex:

```
30
[["8:00", "10:30"],["10:30","10:40"],["11:15", "12:45"]]
["8:00", "16:00"]
[["10:00", "10:30"],["11:15", "12:45"]]
["8:00", "12:00"]
```

- 30 minute meeting between 2 people.
- Person 1 has meetings from 8-10:30, 10:30-10:40, 11:15-12:45 and is in the ofice from 8-4.
- Person 2 has meetings from 10-10:30, 11:15-12:45 and is in the office from 8-12.

## Example output

```
npm start -- ./schedule.txt


Person #0:
        Work Day:       8:00 - 16:00
        Calendar:       8:00 - 10:30, 10:30 - 10:40, 11:15 - 12:45
Person #1:
        Work Day:       8:00 - 12:00
        Calendar:       10:00 - 10:30, 11:15 - 12:45
Person #2:
        Work Day:       8:00 - 12:00
        Calendar:       10:00 - 10:30, 11:15 - 12:45
Person #3:
        Work Day:       8:00 - 12:00
        Calendar:       10:00 - 10:30, 11:15 - 12:45
Person #4:
        Work Day:       8:00 - 12:00
        Calendar:       10:00 - 10:30, 11:15 - 12:45
Person #5:
        Work Day:       8:00 - 12:00
        Calendar:       10:00 - 10:30, 11:15 - 12:45
Person #6:
        Work Day:       8:00 - 12:00
        Calendar:       10:00 - 10:30, 11:15 - 12:45
from: 480 to: 720
---------------------------------------------------------------
Meeting Schedule Results:
        Meeting Length: 30
        Time Slots:     10:40 - 11:10, 10:55 - 11:25, 11:10 - 11:40, 11:25 - 11:55
```
