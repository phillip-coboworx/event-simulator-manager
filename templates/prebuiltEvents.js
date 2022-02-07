const { Interval, Intervals, ChangeEvent, ShiftStartEvent, ShiftEndEvent, StatusEvent } = require('../classes');

module.exports = new Intervals('sim000001', 3, [
  new Interval([
    new ShiftStartEvent(),
    new StatusEvent(1, 'Connecting...'),
  ]),
  new Interval([
    new StatusEvent(4, 'Connected and Running'),
    new ChangeEvent({ changed_field: 'downtime', downtime_status_code: 0 }, true),
  ], 5),
  new Interval([
    new StatusEvent(3, 'No parts left'),
    new ChangeEvent({ changed_field: 'downtime', downtime_status_code: 1 }),
  ]),
  new Interval([
    new StatusEvent(4, 'Connected and Running'),
    new ChangeEvent({ changed_field: 'downtime', downtime_status_code: 0 }, true),
  ], 5),
  new Interval([
    new ShiftEndEvent(),
  ]),
]);
