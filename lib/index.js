const commander = require('commander');
const config = require('../package.json');
const server = require('./server');
const generateTokens = require('./tokens');

const command = require('./command');

commander
   .usage('neutron <command>');

commander
   .version(config.version);

commander
  .command('server')
  .option('-p, --port <port>', 'listening port', 9001)
  .option('-с, --configPath <configPath>', 'path to config', 'neutron.json')
  .option('-d, --dir <dir>', 'dir', '.')
  .option('-e, --enable-dashboard [enableDashboard]', 'dashboard', true)
  .option('-i, --is-ping-available [isPingAvailable]', 'is ping available', true)
  .description('stat faas dev server')
  .action(server);

commander
  .command('generate-tokens')
  .option('-с, --configPath <configPath>', 'path to config', 'neutron.json')
  .description('generate keys / jwn tokens')
  .action(options => command(generateTokens, options));

module.exports = () => {
  commander.parse(process.argv);
};
