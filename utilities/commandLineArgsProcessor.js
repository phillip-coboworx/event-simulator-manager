module.exports.Processor = (argv) => {
  const possibleArguments = ['file', 'format'];
  const passedArguments = {};
  let passedArgumentCount = 0;
  let events = {};

  argv.forEach((val, index) => {
    if (index > 1) {
      const arg = val.split('=');
      arg[0] = arg[0].slice(2);

      if (!possibleArguments.includes(arg[0])) {
        throw 'Invalid parameters!';
      }

      passedArguments[arg[0]] = arg[1];
      passedArgumentCount++;
    }
  });

  if (passedArgumentCount === possibleArguments.length || passedArgumentCount === 0) {
    if (objectIsEmpty) {
      events = require('./YAMLFileParser').FileParser('./template_files/events.yml');
    } else {
      switch (passedArguments.format.toLowerCase()) {
        case 'yaml':
          if (hasCorrectFileExtension) {
            events = require('./YAMLFileParser').FileParser(passedArguments.file);
          } else {
            throw 'Invalid file extension!';
          }

          break;
        case 'json':
          if (hasCorrectFileExtension) {
            events = require(passedArguments.file);
          } else {
            throw 'Invalid file extension!';
          }

          break;
        default:
          throw 'Invalid format!';
      }
    }
  } else {
    throw 'Invalid parameter count! Either none or all parameters have to be defined!';
  }

  function objectIsEmpty(object) {
    for (const i in object) {
      return false;
    }

    return true;
  }

  function hasCorrectFileExtension(path, correctFileExtension) {
    return fname.slice((fname.lastIndexOf('.') - 1 >>> 0) + 2) === correctFileExtension;
  }

  return events;
};
