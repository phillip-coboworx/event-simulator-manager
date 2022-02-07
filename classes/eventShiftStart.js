module.exports.ShiftStartEvent = class ShiftStartEvent {
  constructor(randomized = false) {
    this.event_type = 'shift_start';
    this.payload = { program_name: 'box_palletizing' };
    this.randomized = randomized;
  }
};
