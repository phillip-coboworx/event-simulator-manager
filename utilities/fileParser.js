const YAMLParser = require('./YAMLParser').Parser;

module.exports.FileParser = (passedArguments) => {
  const simulatorSettings = {};
  let events = {};

  function hasCorrectFileExtension(path, correctFileExtension) {
    const fileExtension = (path.match(/[^\\/]\.([^\\/.]+)$/) || [null]).pop();
    return fileExtension === correctFileExtension;
  }

  if (passedArguments.file && passedArguments.format) {
    switch (passedArguments.format.toLowerCase()) {
      case 'yaml':
        if (hasCorrectFileExtension) {
          events = YAMLParser(passedArguments.file);
        } else {
          throw new Error('Invalid file extension!');
        }
        break;

      case 'json':
        if (hasCorrectFileExtension) {
          try {
            events = require(passedArguments.file);
          } catch (err) {
            throw new Error(err);
          }
        } else {
          throw new Error('Invalid file extension!');
        }
        break;

      default:
        throw new Error('Invalid format!');
    }
  } else if ((passedArguments.file && !passedArguments.format)
    || (!passedArguments.file && passedArguments.format)) {
    throw new Error('Invalid parameter count! Either none or all parameters have to be defined!');
  } else {
    events = YAMLParser('./template_files/events.yml');
  }

  simulatorSettings.loop = !!passedArguments.loop;

  return [simulatorSettings, events];
};
