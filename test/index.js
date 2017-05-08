const librato = require('..');
const nock = require('nock');

const token = 'whatever';

// FIXME(Tim): This is not nocking properly... could it be b/c I am using request-promise-native?
describe('librato', function () {
  beforeEach(function () {
    nock.disableNetConnect();
    nock('https://metrics-api.librato.com').post('/v1/measurements', /.*/);
  });

  afterEach(function () {
    nock.restore();
  });

  it('does nothing if no config', function () {
    return librato();
  });

  it('inits the metric as a counter', function () {
    this.timeout(10000);
    return librato({ username: 'me@my.com', token }, 'test.metric', { person: 'tim' });
  });
});
