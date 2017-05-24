# Librato-simple [![Build Status](https://secure.travis-ci.org/noblesamurai/librato-simple.png?branch=master)](http://travis-ci.org/noblesamurai/librato-simple) [![NPM version](https://badge-me.herokuapp.com/api/npm/librato-simple.png)](http://badges.enytc.com/for/npm/librato-simple)

> Simple metrics posting to librato.

## Purpose
The existing librato modules do not seem to support tags.  This is a currently
a minimum viable product implementation of posting a metric using gauges
with custom tags.  (It does no aggregation and makes one
requests per call). Watch out for costs on your account if you use
this - repeat it does one request to librato per call.

## Usage

```js
const librato = require('librato-simple');
const config = { email: 'me@my.com, token: 'librato_token' };
librato(config, 'mymetric.awesome', { color: 'blue', machine: 'thing' }).then(function () {
  // we're done, defaults to value of 1 ...
});

```

## API

```js
/**
 * @param {Object} config - { email, token }
 * @param {string} name - the name of your metric
 * @param {Object} tags - { /* your tags */ }
 * @param {Number} value - The value to submit
 * @resolves {Promise}
 */

librato(config, name, tags, value) => Promise
```


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

