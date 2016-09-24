const path = require('path');
const NeutronConfig = require('./neutron-config');

const readConfig = configPath => {
  const config = require(path.resolve('.', configPath));
  return new NeutronConfig(config);
};

module.exports = (command, options) => {
  const config = readConfig(options.configPath);

  return command(config, options);
};
