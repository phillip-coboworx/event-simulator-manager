const FileReader = require('fs').readFileSync;
const YAML = require('yaml');

module.exports.Parser = (path) => {
  try {
    const file = FileReader(path, 'utf8');
    return YAML.parse(file);
  } catch (err) {
    throw new Error(`Error while parsing YAML file! ${err}`);
  }
};
