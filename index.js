const request = require('request-promise-native');
const endpoint = 'https://metrics-api.librato.com/v1/measurements';

/**
 * Submit metric with given name and value ( or 1 if omitted).
 * config: { username, password }
 * tags: Whatever you want.
 */
module.exports = function (config, name, tags, value) {
  value = value !== undefined ? value : 1;
  if (!config || !config.email || !config.token) return Promise.resolve();
  const body = {
    measurements: [
      { name, value, tags }
    ]
  };

  return request.post(endpoint, {
    auth: { username: config.email, password: config.token },
    json: true,
    body
  }).catch(function (err) {
    console.error('librato error', err);
  });
};
