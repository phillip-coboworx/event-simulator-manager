require('dotenv').config();
const Protocol = require('azure-iot-device-mqtt').Mqtt;
const Client = require('azure-iot-device').Client;
const Message = require('azure-iot-device').Message;

const connectionString = process.env.CONNECTION_STRING || "";

let sendInterval;

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
    console.log("Connected");

    if (!sendInterval) {
        sendInterval = setInterval(() => {
          const message = generateMessage()
          console.log('Sending message: ' + message.getData())
          client.sendEvent(message, printResultFor('send'))
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

function messageHandler() {
    console.log('Id: ' + msg.messageId + ' Body: ' + msg.data);
    client.complete(msg, printResultFor('completed'));
}

function generateMessage () {
    var windSpeed = 10 + (Math.random() * 4); // range: [10, 14]
    var temperature = 20 + (Math.random() * 10); // range: [20, 30]
    var humidity = 60 + (Math.random() * 20); // range: [60, 80]
    const data = JSON.stringify({ deviceId: 'sim000001', windSpeed: windSpeed, temperature: temperature, humidity: humidity });
    const message = new Message(data);
    message.properties.add('temperatureAlert', (temperature > 28) ? 'true' : 'false');
    return message;
}

function printResultFor(op) {
    return function printResult(err, res) {
      if (err) console.log(op + ' error: ' + err.toString());
      if (res) console.log(op + ' status: ' + res.constructor.name);
    };
}
