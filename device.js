require('dotenv').config();
const { argv } = require('process');

const Protocol = require('azure-iot-device-mqtt').Mqtt;
const { Client } = require('azure-iot-device');
const { Message } = require('azure-iot-device');
const passedArguments = require('./utilities/commandLineArgsProcessor').Processor(argv);
const [simulatorSettings, events] = require('./utilities/fileParser').FileParser(passedArguments);

const connectionString = process.env.CONNECTION_STRING || '';
const keepAliveSendInterval = events.keep_alive_send_interval;
const intervalLimit = events.intervals.length;
const runInLoop = simulatorSettings.loop;
const nodeId = events.node_id;

let intervalCount = 0;
let intervalLength;

if (connectionString === '') {
  throw new Error('Device connection string not set!');
}

const client = Client.fromConnectionString(connectionString, Protocol);
client.on('connect', connectHandler);
client.on('error', errorHandler);
client.on('disconnect', disconnectHandler);
client.on('message', messageHandler);

client.open()
  .catch((err) => {
    console.error(`Could not connect: ${err.message}`);
  });

function errorHandler(error) {
  throw new Error(error);
}

function disconnectHandler() {
  client.open().catch((err) => {
    throw new Error(err);
  });
}

function messageHandler(msg) {
  console.log(`Id: ${msg.messageId} Body: ${msg.data}`);
  client.complete(msg, callbackHandler('completed'));
}

function connectHandler() {
  intervalLength = events.intervals[intervalCount].interval_length * 1000 || 2000;
  setTimeout(() => setIntervalActions(), intervalLength);
}

function setIntervalActions() {
  const message = generateMessage();
  console.log(`Sending message: \n ${message.getData()} \n`);
  client.sendEvent(message, callbackHandler('send'));

  intervalCount = runInLoop ? (intervalCount + 1) % intervalLimit : intervalCount += 1;

  if (intervalCount >= intervalLimit) {
    client.close();
    process.exit();
  } else {
    intervalLength = events.intervals[intervalCount].interval_length * 1000 || 2000;
    setTimeout(() => setIntervalActions(), intervalLength);
  }
}

function generateMessage() {
  const intervalEvents = [];
  events.intervals[intervalCount].events.forEach((event) => {
    if (!(event.randomized || false) || Math.random() >= 0.5) {
      intervalEvents.push(
        JSON.stringify(generateMessageContent(event.event_type, event.payload)),
      );
    }
  });

  if ((intervalCount + 1) % keepAliveSendInterval === 0) {
    intervalEvents.push(JSON.stringify(generateMessageContent('keep_alive', { connection_status_code: 1 })));
  }

  const message = new Message(`[${intervalEvents.join(',')}]`);
  return message;
}

function generateMessageContent(eventType, payload) {
  const data = {};
  data.nodeId = nodeId;
  data.timestamp = Date.now();
  data.event = eventType;
  data.payload = payload;

  return data;
}

function callbackHandler(op) {
  return function printResult(err, res) {
    if (err) console.log(`${op} error: ${err.toString()}`);
    if (res) console.log(`${op} status ${res.constructor.name}`);
  };
}
