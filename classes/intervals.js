module.exports.Intervals = class Intervals {
  constructor(nodeId, keepAliveSendInterval, intervals) {
    this.node_id = nodeId;
    this.keep_alive_send_interval = keepAliveSendInterval;
    this.intervals = intervals;
  }
};
