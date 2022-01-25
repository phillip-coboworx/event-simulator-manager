require('dotenv').config();
const { argv, eventNames } = require('process');

const Protocol = require('azure-iot-device-mqtt').Mqtt;
const { Client } = require('azure-iot-device');
const { Message } = require('azure-iot-device');
const passedArguments = require('./utilities/commandLineArgsProcessor').Processor(argv);
const [simulatorSettings, events] = require('./utilities/fileParser').FileParser(passedArguments);

const connectionString = process.env.CONNECTION_STRING || '';
const keepAliveSendInterval = events.keep_alive_send_interval;
const intervalLimit = events.intervals.length;
const runInLoop = simulatorSettings.loop;

let messageCount = 0;
let sendInterval;

if (connectionString === '') {
  console.log('device connection string not set');
  process.exit(-1);
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

function connectHandler() {
  if (!sendInterval) {
    sendInterval = setInterval(() => {
      const message = generateMessage();
      console.log(`Sending message: \n ${JSON.stringify(message.getData())} \n`);
      client.sendEvent(message, callbackHandler('send'));

      messageCount = runInLoop ? (messageCount + 1) % intervalLimit : messageCount += 1;
    }, 2000);
  }
}

function errorHandler(error) {
  console.error(error.message);
}

function disconnectHandler() {
  clearInterval(sendInterval);
  sendInterval = null;

  client.open().catch((err) => {
    console.error(err.message);
  });
}

function messageHandler(msg) {
  console.log(`Id: ${msg.messageId} Body: ${msg.data}`);
  client.complete(msg, callbackHandler('completed'));
}

function generateMessageContent(eventType, payload) {
  const data = {};
  data.nodeId = 'sim000001';
  data.timestamp = Date();
  data.event = eventType;
  data.payload = payload;

  return data;
}

function generateMessage() {
  if (messageCount >= intervalLimit) {
    clearInterval(sendInterval);
    sendInterval = null;
    client.close();
    process.exit();
  }

  const intervalEvents = [];
  events.intervals[messageCount].events.forEach((event) => {
    if (!event.randomized || Math.random() >= 0.5) {
      intervalEvents.push(
        JSON.stringify(generateMessageContent(event.event_type, event.payload)),
      );
    }
  });

  if ((messageCount + 1) % keepAliveSendInterval === 0) {
    intervalEvents.push(JSON.stringify(generateMessageContent('keep_alive', { connection_status_code: 1 })));
  }

  const message = new Message(intervalEvents.join(','));
  return message;
}

function callbackHandler(op) {
  return function printResult(err, res) {
    if (err) console.log(`${op} error: ${err.toString()}`);
    if (res) console.log(`${op} status ${res.constructor.name}`);
  };
}
