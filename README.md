# Librato-simple [![Build Status](https://secure.travis-ci.org/noblesamurai/librato-simple.png?branch=master)](http://travis-ci.org/noblesamurai/librato-simple) [![npm version](https://badge.fury.io/js/librato-simple.svg)](https://badge.fury.io/js/librato-simple)

> Simple metrics posting to librato.

## Purpose
The existing librato modules do not seem to support tags.

## Usage

```js
const config = {
  email: 'me@my.com',
  token: 'librato_token',
  debounceTime: 1000,
  limit: 500
};
const librato = require('librato-simple')(config);

librato.queue('some.metric', { color: 'blue', machine: 'thing' });
librato.queue('some.other.metric', { color: 'blue', machine: 'thing' });

// These messages will be queued and sent out after `debounceTime`.
// If you want to force all the messages currently queued to be sent...
librato.send().then(function () {
  // all queued messages should have been sent now.
});
```

## API

### Setup

```js
const librato = require('librato-simple')(config);
```

Options:
* `email` and `token` -- required auth parameters. Without these being set all
  calls to `.queue()` or `.send()` will do nothing.
* `prefix` -- a prefix to be added to all measurement names.
* `debounceTime` -- how long to wait after the last measurement is queued
  before all queued measurements are sent.
* `limit` -- the maximum number of measurements to queue before it is sent
  without any further delay.

### Queue measurements to be sent

```js
librato.queue(name, tags, value);
```

Variables:
* `name` -- the name of the metric/measurement you are recording.
* `tags` -- an array of whatever tags to be attached to this measurement.
* `value` -- the value of this measurement (defaults to `1`).

### Force all remaining messages to be sent

```js
librato.send().then(function () { /* ... */ });
```

This flushes the queued measurements and returns a promise that will resolve
once all measurements have been sent.

## Installation

This module is installed via npm:

``` bash
$ npm install librato-simple
```
## License

The BSD License

Copyright (c) 2017, Tim Allen

All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice, this
  list of conditions and the following disclaimer in the documentation and/or
  other materials provided with the distribution.

* Neither the name of the Tim Allen nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

