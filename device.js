require('dotenv').config();
// const Events = require("./events");
const Events = require("./eventFileParser");
const Protocol = require('azure-iot-device-mqtt').Mqtt;
const Client = require('azure-iot-device').Client;
const Message = require('azure-iot-device').Message;

const connectionString = process.env.CONNECTION_STRING || "";
const intervalLimit = Events.intervals.length;
const keepAliveSendInterval = 2;

let sendInterval;
let messageCount = 0;

if(connectionString === "") {
    console.log('device connection string not set');
    process.exit(-1);
}

let client = Client.fromConnectionString(connectionString, Protocol);
client.on('connect', connectHandler);
client.on('error', errorHandler);
client.on('disconnect', disconnectHandler);
client.on('message', messageHandler);

client.open()
.catch(err => {
  console.error('Could not connect: ' + err.message);
});

function connectHandler() {

  if (!sendInterval) {
      sendInterval = setInterval(() => {
        
        const message = generateMessage();
        console.log('Sending message: ' + "\n" + JSON.stringify(message.getData()) + "\n");
        //client.sendEvent(message, printResultFor('send'));
        
        messageCount++;
        if(messageCount >= intervalLimit) {
          clearInterval(sendInterval);
          sendInterval = null;
          client.close();
          process.exit();
        }
        
      }, 1000);
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

function messageHandler() {
    console.log('Id: ' + msg.messageId + ' Body: ' + msg.data);
    client.complete(msg, printResultFor('completed'));
}


function generateMessage () {

    let intervalEvents = [];

    Events.intervals[messageCount].events.forEach(event => {
      let data = {};
      data.node_id = "sim000001";
      data.timestamp = Date();
      data.event = event.event_type;
      data.payload = event.payload;

      intervalEvents.push(JSON.stringify(data));
    });

    if((messageCount + 1) % keepAliveSendInterval === 0) {
      let data = {};
      data.node_id = "sim000001";
      data.timestamp = Date();
      data.event = "keep_alive";
      data.payload = {
        "connection_status_code": 1
      }

      intervalEvents.push(JSON.stringify(data));
    }

    const message = new Message(intervalEvents.join(','));
    return message;
}

function printResultFor(op) {
    return function printResult(err, res) {
      if (err) console.log(op + ' error: ' + err.toString());
      if (res) console.log(op + ' status: ' + res.constructor.name);
    };
}
