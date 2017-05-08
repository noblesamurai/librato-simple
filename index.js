const request = require('request-promise-native');
const endpoint = 'https://metrics-api.librato.com/v1/measurements';

/**
 * Increment metric with given name by 1.
 * config: { username, password }
 * tags: Whatever you want.
 */
module.exports = function (config, name, tags) {
  if (!config || !config.email || !config.token) return Promise.resolve();
  const body = {
    measurements: [
      { name, value: 1, tags }
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
