const FileReader = require('fs').readFileSync;
const YAML = require('yaml');

const file = FileReader('./events.yml', 'utf8');
const events = YAML.parse(file);

module.exports = events;