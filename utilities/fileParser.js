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
        try {
          events = YAMLParser(passedArguments.file);
        } catch (error) {
          throw new Error('Error while parsing the yaml file: ', error);
        }
        break;

      case 'json':
      case 'js':
        try {
          events = require(passedArguments.file);
        } catch (error) {
          throw new Error('Error while parsing the json file: ', error);
        }
        break;

      default:
        throw new Error('Invalid format!');
    }
  }

  return events;
};
