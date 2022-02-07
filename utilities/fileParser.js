const YAMLParser = require('./YAMLParser').Parser;

module.exports.FileParser = (passedArguments) => {
  const simulatorSettings = {};
  let events = {};

  function GetFileExtension(file) {
    return (file.match(/[^\\/]\.([^\\/.]+)$/) || [null]).pop();
  }

  if (passedArguments.file) {
    const fileExtension = GetFileExtension(passedArguments.file).toLowerCase();

    switch (fileExtension) {
      case 'yaml':
        events = YAMLParser(passedArguments.file);
        break;

      case 'json':
        events = require(passedArguments.file);
        break;

      case 'js':
        events = require(passedArguments.file);
        break;

      default:
        throw new Error('Invalid format!');
    }
  } else {
    events = YAMLParser('./templates/events.yml');
  }

  simulatorSettings.loop = !!passedArguments.loop;

  return [simulatorSettings, events];
};
