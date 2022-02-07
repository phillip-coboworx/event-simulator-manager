module.exports.ShiftEndEvent = class ShiftEndEvent {
  constructor(randomized = false) {
    this.event_type = 'shift_end';
    this.payload = {};
    this.randomized = randomized;
  }
};
