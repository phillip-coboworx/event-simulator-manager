const { Interval, Intervals, Event } = require('../classes');

module.exports = new Intervals('sim000001', 3, [
  new Interval([
    new Event('shift_start', { program_name: 'box_palletizing' }),
    new Event('status', { status_code: 1, status_information: 'Connecting...' }),
  ]),
  new Interval([
    new Event('status', { status_code: 4, status_information: 'Connected and Running' }),
    new Event('change', { changed_field: 'downtime', downtime_status_code: 0 }, true),
  ], 5),
  new Interval([
    new Event('status', { status_code: 3, status_information: 'No parts left' }),
    new Event('change', { changed_field: 'downtime', downtime_status_code: 1 }),
  ]),
  new Interval([
    new Event('status', { status_code: 4, status_information: 'Connected and Running' }),
    new Event('change', { changed_field: 'downtime', downtime_status_code: 0 }, true),
  ], 5),
  new Interval([
    new Event('shift_end', {}),
  ]),
]);
