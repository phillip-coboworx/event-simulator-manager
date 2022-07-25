const YAMLParser = require('./YAMLParser').Parser;

module.exports.FileParser = (passedArguments) => {
  let events = {};

  function GetFileExtension(file) {
    return (file.match(/[^\\/]\.([^\\/.]+)$/) || [null]).pop();
  }

  if (!passedArguments.file || passedArguments.file === '') {
    events = YAMLParser('./templates/events.yml');
  } else {
    const fileExtension = GetFileExtension(passedArguments.file).toLowerCase();

    switch (fileExtension) {
      case 'yml':
      case 'yaml':
        events = YAMLParser(passedArguments.file);
        break;

      case 'json':
      case 'js':
        events = require(passedArguments.file);
        break;

      default:
        throw new Error('Invalid format!');
    }
  }

  return events;
};
