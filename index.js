const request = require('request-promise-native');
const endpoint = 'https://metrics-api.librato.com/v1/measurements';

function parsePrefix (prefix) {
  if (!prefix || !prefix.length) return '';
  return prefix.replace(/\.$/, '') + '.';
}

module.exports = function librato (config = {}) {
  const {
    email: username,
    token: password,
    debounceTime = 1000,
    limit = 500
  } = config;
  const prefix = parsePrefix(config.prefix);
  const auth = username && password && { username, password };
  const measurements = [];
  let sendTimeout;

  /**
   * Queue a metric to be sent with a given name and value (or 1 if omitted).
   * @param {string} name
   * @param {Object} tags
   * @param {*} value
   */
  const queue = (name, tags, value = 1) => {
    // don't queue anything if we don't have any auth info to send it with.
    if (!auth) return;
    measurements.push({ name: `${prefix}${name}`, value, tags });
    sendDelayed();
  };

  /**
   * Send currently queued measurements.
   * @param {boolean} debounce set to true if in the case of having more than
   *   the limited number of measurements, you would like the excess to be
   *   debounced still.
   */
  const send = (debounce = false) => {
    // stop if no auth or if there is nothing to send.
    if (!auth || !measurements.length) return Promise.resolve();
    const body = { measurements: measurements.splice(0, limit) };
    return request.post(endpoint, { auth, json: true, body }).then(() => {
      return debounce ? sendDelayed() : send();
    }).catch(function (err) {
      console.error('librato error', err);
    });
  };

  /**
   * Delay sending for a period of time (defined by debounceTime)... unless
   * the we have more measurements than the limit.
   */
  const sendDelayed = () => {
    clearTimeout(sendTimeout);
    if (measurements.length < limit) {
      sendTimeout = setTimeout(send.bind(true), debounceTime);
    } else {
      send(true);
    }
  };

  return { queue, send };
};
