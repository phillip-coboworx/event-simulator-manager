require('dotenv').config();
const { spawn } = require('child_process');

const eventFiles = ['./config_files/eventsDev1.yml', './config_files/eventsDev2.yml', './config_files/eventsDev3.yml'];

const connectionStrings = process.env.CONNECTION_STRINGS.split(' ');
const deviceIds = connectionStrings.map((conn) => conn
  .split(';')
  .find((params) => params.split('=')[0] === 'DeviceId')
  .split('=')[1]);

for (let i = 0; i < connectionStrings.length; i += 1) {
  const child = spawn('node', ['device.js', `connString ${connectionStrings[i]}`, `deviceId ${deviceIds[i]}`, `file ${eventFiles[i]}`]);

  child.stdout.setEncoding('utf8');
  child.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  child.stderr.setEncoding('utf8');
  child.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  child.on('error', (err) => {
    console.log(err);
  });

  child.on('exit', (code, signal) => {
    console.log('child process exited with '
                + `code ${code} and signal ${signal}`);
  });
}
