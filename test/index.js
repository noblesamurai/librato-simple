const expect = require('chai').expect;
const proxyquire = require('proxyquire').noPreserveCache();
const sinon = require('sinon');

const email = 'me@my.com';
const token = 'whatever';

describe('librato', function () {
  it('should do nothing if there is no config', function () {
    const post = sinon.stub().resolves();
    const librato = proxyquire('..', { 'request-promise-native': { post } })();
    librato.queue('test.metric', { tag: 'something' });
    return librato.send().then(() => {
      expect(post).to.have.not.been.called();
    });
  });

  it('should do nothing if there have been no messages queued', function () {
    const post = sinon.stub().resolves();
    const librato = proxyquire('..', { 'request-promise-native': { post } })({ email, token });
    return librato.send().then(() => {
      expect(post).to.have.not.been.called();
    });
  });

  it('should send a queued message', function () {
    const post = sinon.stub().resolves();
    const librato = proxyquire('..', { 'request-promise-native': { post } })({ email, token });
    const name = 'test.metric';
    const tags = { tag: 'something' };
    const value = 42;
    librato.queue(name, tags, value);
    return librato.send().then(() => {
      expect(post).to.have.been.called();
      expect(post).to.have.been.calledWith(
        'https://metrics-api.librato.com/v1/measurements',
        sinon.match({
          auth: { username: email, password: token },
          json: true,
          body: { measurements: [{ name, tags, value }] }
        })
      );
    });
  });

  it('should send a prefixed message', function () {
    const post = sinon.stub().resolves();
    const prefix = 'prefix';
    const librato = proxyquire('..', { 'request-promise-native': { post } })({ email, token, prefix });
    const name = 'test.metric';
    const tags = { tag: 'something' };
    const value = 42;
    librato.queue(name, tags, value);
    return librato.send().then(() => {
      expect(post).to.have.been.called();
      expect(post).to.have.been.calledWith(
        'https://metrics-api.librato.com/v1/measurements',
        sinon.match({
          auth: { username: email, password: token },
          json: true,
          body: { measurements: [{ name: `${prefix}.${name}`, tags, value }] }
        })
      );
    });
  });

  it('should send a queued message with a default value of 1', function () {
    const post = sinon.stub().resolves();
    const librato = proxyquire('..', { 'request-promise-native': { post } })({ email, token });
    const name = 'test.metric';
    const tags = { tag: 'something' };
    librato.queue(name, tags);
    return librato.send().then(() => {
      expect(post).to.have.been.called();
      expect(post).to.have.been.calledWith(
        'https://metrics-api.librato.com/v1/measurements',
        sinon.match({
          auth: { username: email, password: token },
          json: true,
          body: { measurements: [{ name, tags, value: 1 }] }
        })
      );
    });
  });

  it('should send multiple queued messages', function () {
    const post = sinon.stub().resolves();
    const librato = proxyquire('..', { 'request-promise-native': { post } })({ email, token });
    const measurements = [
      { name: 'test.metric', tags: { a: 1, b: 2 }, value: 9 },
      { name: 'another.test.metric', tags: { c: 2 }, value: 1 },
      { name: 'test.metric', tags: { a: 5, b: 9 }, value: 4 },
      { name: 'test.metric', tags: { b: 8 }, value: 2 }
    ];
    measurements.forEach(({ name, tags, value }) => librato.queue(name, tags, value));
    return librato.send().then(() => {
      expect(post).to.have.been.called();
      expect(post).to.have.been.calledWith(
        'https://metrics-api.librato.com/v1/measurements',
        sinon.match({
          auth: { username: email, password: token },
          json: true,
          body: { measurements }
        })
      );
    });
  });

  it('should send multiple queued messages immediatly if limit is reached', function () {
    const post = sinon.stub().resolves();
    const librato = proxyquire('..', { 'request-promise-native': { post } })({ email, token, limit: 2 });
    const measurements = [
      { name: 'test.metric', tags: { a: 1, b: 2 }, value: 9 },
      { name: 'another.test.metric', tags: { c: 2 }, value: 1 }
    ];
    measurements.forEach(({ name, tags, value }) => {
      expect(post).to.have.not.been.called();
      librato.queue(name, tags, value);
    });
    expect(post).to.have.been.called();
    expect(post).to.have.been.calledWith(
      'https://metrics-api.librato.com/v1/measurements',
      sinon.match({
        auth: { username: email, password: token },
        json: true,
        body: { measurements }
      })
    );
  });

  it('should send queued messages after a delay', function () {
    const clock = sinon.useFakeTimers();
    const post = sinon.stub().resolves();
    const librato = proxyquire('..', { 'request-promise-native': { post } })({ email, token });
    const name = 'test.metric';
    const tags = { tag: 'something' };
    librato.queue(name, tags);
    expect(post).to.have.not.been.called();
    clock.next();
    expect(post).to.have.been.called();
    expect(post).to.have.been.calledWith(
      'https://metrics-api.librato.com/v1/measurements',
      sinon.match({
        auth: { username: email, password: token },
        json: true,
        body: { measurements: [{ name, tags, value: 1 }] }
      })
    );
  });

  it('should not die on an error', function () {
    const clock = sinon.useFakeTimers();
    const post = sinon.stub()
      .onFirstCall().rejects(new Error('fake error'))
      .resolves();
    const librato = proxyquire('..', { 'request-promise-native': { post } })({ email, token });
    const name = 'test.metric';
    const tags = { tag: 'something' };
    librato.queue('test.metric.error', tags);
    expect(post).to.have.not.been.called();
    clock.next();
    expect(post).to.have.been.called();
    return librato.send().then(() => {
      expect(post).to.have.not.been.calledTwice();
      librato.queue(name, tags);
      clock.next();
      expect(post).to.have.been.calledTwice();
      expect(post).to.have.been.calledWith(
        'https://metrics-api.librato.com/v1/measurements',
        sinon.match({
          auth: { username: email, password: token },
          json: true,
          body: { measurements: [{ name, tags, value: 1 }] }
        })
      );
    });
  });

  it('should flush the whole queue sending in batches of limit', function () {
    const clock = sinon.useFakeTimers();
    const post = sinon.stub()
      .onFirstCall().returns(new Promise((resolve) => setTimeout(resolve, 1)))
      .resolves();
    const librato = proxyquire('..', { 'request-promise-native': { post } })({ email, token });
    const measurements = [
      { name: 'test.metric', tags: { a: 1, b: 2 }, value: 9 },
      { name: 'another.test.metric', tags: { c: 2 }, value: 1 },
      { name: 'test.metric', tags: { a: 5, b: 9 }, value: 4 },
      { name: 'test.metric', tags: { b: 8 }, value: 2 }
    ];

    const [first, ...rest] = measurements;
    librato.queue(first.name, first.tags, first.value);

    // start the send...
    const send = librato.send();
    expect(post).to.have.been.calledOnce();
    expect(post).to.have.been.calledWith(
      'https://metrics-api.librato.com/v1/measurements',
      sinon.match({
        auth: { username: email, password: token },
        json: true,
        body: { measurements: [first] }
      })
    );

    // queue some more items while it is sending and make sure these new
    // measurements are also sent through.
    rest.forEach(({ name, tags, value }, i) => {
      librato.queue(name, tags, value);
    });

    expect(post).to.have.been.calledOnce();
    clock.next();
    return send.then(() => {
      expect(post).to.have.been.calledTwice();
      expect(post).to.have.been.calledWith(
        'https://metrics-api.librato.com/v1/measurements',
        sinon.match({
          auth: { username: email, password: token },
          json: true,
          body: { measurements: rest }
        })
      );
    });
  });
});
