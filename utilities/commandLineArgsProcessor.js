module.exports.Processor = (argv) => {
  const possibleArguments = ['file', 'format', 'loop'];
  const passedArguments = {};

  argv.forEach((val, index) => {
    let arg;

    if (index > 1) {
      try {
        arg = val.split('=');
        arg[0] = arg[0].slice(2);
      } catch (err) {
        console.error(err);
        throw new Error('Invalid parameter formatting!');
      }

      if (!possibleArguments.includes(arg[0])) {
        throw new Error('Invalid parameters!');
      }

      if (arg[0] === 'loop') {
        passedArguments[arg[0]] = true;
      } else {
        passedArguments[arg[0]] = arg[1];
      }
    }
  });

  return passedArguments;
};
