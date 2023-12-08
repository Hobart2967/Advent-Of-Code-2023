const fs = require('fs');
const path = require('path');

module.exports = {
  /**
   *
   * @returns {string}
   */
  getInput: function() {
    const dir = path.resolve(path.dirname(process.argv[1]));
    const name = process.argv[2];

    return fs.readFileSync(path.join(dir, 'inputs', name + '.txt')).toString();
  }
}