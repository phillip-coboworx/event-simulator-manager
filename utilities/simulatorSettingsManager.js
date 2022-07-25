module.exports.SettingsManager = (passedArguments) => {
  if (!passedArguments.connString || passedArguments.connString === '') throw new Error('No connection file was specified!');
  if (!passedArguments.deviceId || passedArguments.deviceId === '') throw new Error('No device ID was specified!');

  const simulatorSettings = {};
  simulatorSettings.loop = !!passedArguments.loop;
  simulatorSettings.connString = passedArguments.connString;
  simulatorSettings.deviceId = passedArguments.deviceId;

  return simulatorSettings;
};
