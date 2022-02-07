module.exports.StatusEvent = class StatusEvent {
  constructor(code, information, randomized = false) {
    this.event_type = 'status';
    this.payload = { status_code: code, status_information: information };
    this.randomized = randomized;
  }
};
