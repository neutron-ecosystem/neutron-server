const generateToken = require('tfk-generate-jwt')

module.exports = (secret, payload) => {
  return generateToken({
    key: secret,
    payload
  });
};
