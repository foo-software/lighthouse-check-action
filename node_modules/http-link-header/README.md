# HTTP Link Header
[![npm](https://img.shields.io/npm/v/http-link-header.svg?style=flat-square)](https://npmjs.com/http-link-header)
[![npm license](https://img.shields.io/npm/l/http-link-header.svg?style=flat-square)](https://npmjs.com/http-link-header)
[![npm downloads](https://img.shields.io/npm/dm/http-link-header.svg?style=flat-square)](https://npmjs.com/http-link-header)
[![build status](https://img.shields.io/travis/jhermsmeier/node-http-link-header.svg?style=flat-square)](https://travis-ci.org/jhermsmeier/node-http-link-header)

Parse & format HTTP link headers according to [RFC 5988]

[RFC 5988]: https://tools.ietf.org/html/rfc5988

## Install via [npm](https://npmjs.com)

```sh
$ npm install --save http-link-header
```

## Usage

```js
var LinkHeader = require( 'http-link-header' )
```

**Parse a HTTP link header**

```js
var link = LinkHeader.parse(
  '<example.com>; rel="example"; title="Example Website", ' +
  '<example-01.com>; rel="alternate"; title="Alternate Example Domain"'
)

> Link {
  refs: [
    { uri: 'example.com', rel: 'example', title: 'Example Website' },
    { uri: 'example-01.com', rel: 'alternate', title: 'Alternate Example Domain' },
  ]
}
```

**Check whether it has a reference with a given attribute & value**

```js
link.has( 'rel', 'alternate' )
> true
```

**Retrieve a reference with a given attribute & value**

```js
link.get( 'rel', 'alternate' )
> [
  { uri: 'example-01.com', rel: 'alternate', title: 'Alternate Example Domain' }
]
```
```js
// Shorthand for `rel` attributes
link.rel( 'alternate' )
> [
  { uri: 'example-01.com', rel: 'alternate', title: 'Alternate Example Domain' }
]
```

**Set references**

```js
link.set({ rel: 'next', uri: 'http://example.com/next' })
> Link {
  refs: [
    { uri: 'example.com', rel: 'example', title: 'Example Website' },
    { uri: 'example-01.com', rel: 'alternate', title: 'Alternate Example Domain' },
    { rel: 'next', uri: 'http://example.com/next' }
  ]
}
```

**Parse multiple headers**

```js
var links = new LinkHeader()

links.parse( '<example.com>; rel="example"; title="Example Website"' )
> Link {
  refs: [
    { uri: 'example.com', rel: 'example', title: 'Example Website' },
  ]
}

links.parse( '<example-01.com>; rel="alternate"; title="Alternate Example Domain"' )
> Link {
  refs: [
    { uri: 'example.com', rel: 'example', title: 'Example Website' },
    { uri: 'example-01.com', rel: 'alternate', title: 'Alternate Example Domain' },
  ]
}

links.parse( '<example-02.com>; rel="alternate"; title="Second Alternate Example Domain"' )
> Link {
  refs: [
    { uri: 'example.com', rel: 'example', title: 'Example Website' },
    { uri: 'example-01.com', rel: 'alternate', title: 'Alternate Example Domain' },
    { uri: 'example-02.com', rel: 'alternate', title: 'Second Alternate Example Domain' },
  ]
}
```

**Stringify to HTTP header format**

```js
link.toString()
> '<example.com>; rel="example"; title="Example Website", <example-01.com>; rel="alternate"; title="Alternate Example Domain"'
```

## Speed

```
$ npm run benchmark
```

```
http-link-header
  parse .......................................... 204,355 op/s
  toString ....................................... 485,465 op/s
```
