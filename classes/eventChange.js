module.exports.ChangeEvent = class ChangeEvent {
  constructor(payload, randomized = false) {
    this.event_type = 'change';
    this.payload = payload;
    this.randomized = randomized;
  }
};
