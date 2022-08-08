require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const { argv } = require('process');

const Protocol = require('azure-iot-device-mqtt').Mqtt;
const { Client } = require('azure-iot-device');
const { Message } = require('azure-iot-device');
const { configFile, simulatorSettings } = require('./utilities/commandLineArgsProcessor').Processor(argv);

const delay = configFile.delay * 1000 || 0;
const cycle = configFile.cycle * 1000 || 2000;
const { events } = configFile;
const runInLoop = configFile.loop;
const repeatCount = configFile.repeatCount || 0;

const eventCount = events.length;

const connectionString = simulatorSettings.connString || '';
const { deviceId } = simulatorSettings;

let loopCounter = 0;
let currentEventIndex = 0;
let intervalLength;
let repetitionCounter = 0;
let useDelay = false;

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
  setIntervalLength();
  setTimeout(() => setIntervalActions(), intervalLength);
}

function setIntervalActions() {
  useDelay = false;
  const message = generateMessage();
  console.log(`Sending message: \n ${message.getData()} \n`);
  client.sendEvent(message, callbackHandler('send'));

  setIntervalCount();
}

// TODO Clean Up
function setIntervalCount() {
  let increaseIndex = true;
  let repetitionCycleOngoing = false;
  if (events[currentEventIndex].repeat > 0 || false) {
    if (repetitionCounter + 1 === events[currentEventIndex].repeat) {
      repetitionCounter = 0;
      repetitionCycleOngoing = false;
    } else if (repetitionCounter + 1 < events[currentEventIndex].repeat) {
      repetitionCounter += 1;
      increaseIndex = false;
      repetitionCycleOngoing = true;
    }
  }

  if (currentEventIndex === eventCount - 1 && !repetitionCycleOngoing) {
    loopCounter += 1;
    useDelay = true;
    console.log("DELAY: ", new Date(), delay);

    // setTimeout(() => setIntervalActions(), delay);
  }

  if (increaseIndex) {
    if (runInLoop) {
      currentEventIndex = (currentEventIndex + 1) % eventCount;
    } else {
      currentEventIndex += 1;
    }
  }
}

function generateMessage() {
  if (!(events[currentEventIndex].randomized || false) || Math.random() >= 0.5) {
    return new Message(
      generateMessageContent(
        events[currentEventIndex].event_type,
        events[currentEventIndex].payload,
      ),
    );
  }
  return new Message('{}');
}

function generateMessageContent(eventType, payload) {
  const data = {};
  data.eventId = uuidv4();
  data.deviceId = deviceId;
  data.timestamp = Date.now();
  data.event = eventType;
  data.payload = payload;

  return JSON.stringify(data);
}

function callbackHandler(op) {
  return function printResult(err, res) {
    if (err) console.log(`${op} error: ${err.toString()}`);
    if (res) {
      console.log(`${op} status ${res.constructor.name}`);
      if (currentEventIndex >= eventCount || (repeatCount > 0 && loopCounter >= repeatCount)) {
        client.close();
        process.exit();
      } else {
        setIntervalLength();
        setTimeout(() => setIntervalActions(), useDelay ? delay : intervalLength);
      }
    }
  };
}

function setIntervalLength() {
  const currIntervalLength = events[currentEventIndex].interval_length;
  if (!currIntervalLength) {
    intervalLength = cycle;
  } else if (!Array.isArray(currIntervalLength)) {
    intervalLength = events[currentEventIndex].interval_length * 1000;
  } else {
    currIntervalLength.sort();
    intervalLength = randomIntFromInterval(currIntervalLength[0], currIntervalLength[1]);
  }
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min) * 1000;
}
