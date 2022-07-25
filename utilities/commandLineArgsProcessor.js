const { FileParser } = require('./fileParser');
const { SettingsManager } = require('./simulatorSettingsManager');

module.exports.Processor = (argv) => {
  const possibleArguments = ['file', 'loop', 'connString', 'deviceId'];
  const passedArguments = {};

  argv.forEach((val, index) => {
    let arg;
    if (index > 1) {
      try {
        arg = val.split(' ');
      } catch (err) {
        console.error(err);
        throw new Error('Invalid parameter formatting!');
      }

      if (!possibleArguments.includes(arg[0])) throw new Error('Invalid parameters!');

      passedArguments[arg[0]] = arg[0] === 'loop' ? true : arg[1];
    }
  });
  const events = FileParser(passedArguments);
  const simulatorSettings = SettingsManager(passedArguments);

  return { events, simulatorSettings };
};
