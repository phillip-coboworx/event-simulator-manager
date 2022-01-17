const FileReader = require('fs').readFileSync;
const YAML = require('yaml');

module.exports.FileParser = (path) => {
    try {
        const file = FileReader(path, 'utf8');
        return YAML.parse(file);
    } catch (err) {
        console.error(err);
    }
};