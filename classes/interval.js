module.exports.Interval = class Interval {
  constructor(events, intervalLength = 2) {
    this.interval_length = intervalLength;
    this.events = events;
  }
};
