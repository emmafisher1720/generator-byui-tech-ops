const chalk = require('chalk');

module.exports = function (key, fileName) {
  try {
    if (/.json/.test(fileName)) {
      this[key] = require(`${this.contextRoot}/${fileName}`);
    } else {
      this[key] = this.fs.read(`${this.contextRoot}/${fileName}`);
    }
  } catch (e) {
    //Error getting file
    this.log(chalk.red("ERROR: " + e.message));
  }

}
