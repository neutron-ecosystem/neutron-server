const chalk = require('chalk');

const info = message => console.log(chalk.blue(message));
const warning = message => console.log(chalk.yellow(message));
const green = message => console.log(chalk.green(message));
const blue = message => console.log(chalk.blue(message));
const magenta = message => console.log(chalk.magenta(message));
const empty = () => console.log('');

const log = message => console.log(message);
const json = json => console.log(JSON.stringify(json, null, 4))

module.exports = {
  info,
  green,
  blue,
  magenta,
  log,
  json,
  empty,
  warning
};
