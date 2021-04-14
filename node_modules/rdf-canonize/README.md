# rdf-canonize

[![Build status](https://img.shields.io/github/workflow/status/digitalbazaar/rdf-canonize/Node.js%20CI)](https://github.com/digitalbazaar/rdf-canonize/actions?query=workflow%3A%22Node.js+CI%22)
[![Coverage status](https://img.shields.io/codecov/c/github/digitalbazaar/rdf-canonize)](https://codecov.io/gh/digitalbazaar/rdf-canonize)
[![Dependency Status](https://img.shields.io/david/digitalbazaar/rdf-canonize.svg)](https://david-dm.org/digitalbazaar/rdf-canonize)

An implementation of the [RDF Dataset Normalization Algorithm][] in JavaScript.

Introduction
------------

...

Installation
------------

### node.js + npm

```
npm install rdf-canonize
```

```js
const canonize = require('rdf-canonize');
```

### node.js + npm + native bindings

This package has support for [rdf-canonize-native][]. This package can be
useful if your application requires doing many canonizing operations
asyncronously in parallel or in the background. It is **highly recommended**
that you understand your requirements and benchmark using JavaScript vs native
bindings. The native bindings add overhead and the JavaScript implementation
may be faster with modern runtimes.

The native bindings are not installed by default and must be explicitly
installed.

```
npm install rdf-canonize
npm install rdf-canonize-native
```

Note that the native code is not automatically used. To use the native bindings
you must have them installed and set the `useNative` option to `true`.

```js
const canonize = require('rdf-canonize');
```

### Browser (AMD) + npm

```
npm install rdf-canonize
```

Use your favorite technology to load `node_modules/dist/rdf-canonize.min.js`.

### HTML

Various NPM proxy CDN sites offer direct access to NPM files.

Examples
--------

```js
const dataset = {
  // ...
};

// canonize a data set with a particular algorithm with async/await
const canonical = await canonize.canonize(dataset, {algorithm: 'URDNA2015'});

// canonize a data set with a particular algorithm and force use of the
// native implementation
const canonical = await canonize.canonize(dataset, {
  algorithm: 'URDNA2015',
  useNative: true
});
```

Related Modules
---------------

* [jsonld.js][]: An implementation of the [JSON-LD][] specification.

Tests
-----

This library includes a sample testing utility which may be used to verify
that changes to the processor maintain the correct output.

The test suite is included in an external repository:

    https://github.com/json-ld/normalization

This should be a sibling directory of the rdf-canonize directory or in a
`test-suites` dir. To clone shallow copies into the `test-suites` dir you can
use the following:

    npm run fetch-test-suite

Node.js tests can be run with a simple command:

    npm test

If you installed the test suites elsewhere, or wish to run other tests, use
the `TEST_DIR` environment var:

    TEST_DIR="/tmp/tests" npm test

To generate earl reports:

    # generate the earl report for node.js
    EARL=earl-node.jsonld npm test

Benchmark
---------

See docs in the [benchmark README](./benchmark/README.md).

Source
------

The source code for this library is available at:

https://github.com/digitalbazaar/rdf-canonize

Commercial Support
------------------

Commercial support for this library is available upon request from
[Digital Bazaar][]: support@digitalbazaar.com

[Digital Bazaar]: https://digitalbazaar.com/
[JSON-LD]: https://json-ld.org/
[RDF Dataset Normalization Algorithm]: https://json-ld.github.io/normalization/
[jsonld.js]: https://github.com/digitalbazaar/jsonld.js
[rdf-canonize-native]: https://github.com/digitalbazaar/rdf-canonize-native
