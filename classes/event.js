module.exports.Event = class Event {
  constructor(eventType, payload, randomized = false) {
    this.event_type = eventType;
    this.payload = payload;
    this.randomized = randomized;
  }
};
