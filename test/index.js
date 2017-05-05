const librato = require('..');
const nock = require('nock');

const token = '23fe05b7ee166dabe7cfad35c6d09f48c347f37f182d3b01ffecebb8aac2b073';

// FIXME(Tim): This is not nocking properly... could it be b/c I am using request-promise-native?
describe.skip('librato', function () {
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
    return librato({ username: 'devteam+librato@noblesamurai.com', token }, 'test.metric', { person: 'tim' });
  });
});
