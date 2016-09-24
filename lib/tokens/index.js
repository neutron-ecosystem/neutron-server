const generate = require('./generate');

module.exports = (config, options) => {
  const secret = config.getSecretKey();
  const payload = config.getTokePayload();

  const token = generate(secret, payload);

  console.log(token);
};
