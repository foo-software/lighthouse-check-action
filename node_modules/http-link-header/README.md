# HTTP Link Header
[![npm](https://img.shields.io/npm/v/http-link-header.svg?style=flat-square)](https://npmjs.com/http-link-header)
[![npm license](https://img.shields.io/npm/l/http-link-header.svg?style=flat-square)](https://npmjs.com/http-link-header)
[![npm downloads](https://img.shields.io/npm/dm/http-link-header.svg?style=flat-square)](https://npmjs.com/http-link-header)

Parse & format HTTP link headers according to [RFC 8288]

[RFC 8288]: https://tools.ietf.org/html/rfc8288

## Install via [npm](https://npmjs.com)

```sh
$ npm install --save http-link-header
```

## Deviations from the RFC

### Link Target

While [RFC 8288, Section 3.1](https://tools.ietf.org/html/rfc8288#section-3.1) states that relative URI-References
MUST be resolved by the parsers – this library DOES NOT.
This is due to the parser not having an input for the absolute or canonical URI of the related document.
Currently there are no plans to add this, and it is left to the user whether or not to resolve relative URIs.

## Usage

```js
var LinkHeader = require( 'http-link-header' )
```

### Parsing a HTTP link header

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

### Checking whether it has a reference with a given attribute & value

```js
link.has( 'rel', 'alternate' )
> true
```

### Retrieving a reference with a given attribute & value

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

### Setting references

```js
link.set({ uri: 'https://example.com/next', rel: 'next' })
> Link {
  refs: [
    { uri: 'example.com', rel: 'example', title: 'Example Website' },
    { uri: 'example-01.com', rel: 'alternate', title: 'Alternate Example Domain' },
    { rel: 'next', uri: 'https://example.com/next' }
  ]
}
```

### Setting a unique reference

```js
link.setUnique({
  uri: 'https://example.com/image.png',
  rel: 'preload',
  as: 'image',
  type: 'image/png'
})
> Link {
  refs: [
    { uri: 'https://example.com/image.png', rel: 'preload', as: 'image', type: 'image/png' }
  ]
}

link.setUnique({
  uri: 'https://example.com/image.png',
  rel: 'preload',
  as: 'image',
  type: 'image/png'
})
> Link {
  refs: [
    { uri: 'https://example.com/image.png', rel: 'preload', as: 'image', type: 'image/png' }
  ]
}
```

### Parsing multiple headers

```js
var link = new LinkHeader()

link.parse( '<example.com>; rel="example"; title="Example Website"' )
> Link {
  refs: [
    { uri: 'example.com', rel: 'example', title: 'Example Website' },
  ]
}

link.parse( '<example-01.com>; rel="alternate"; title="Alternate Example Domain"' )
> Link {
  refs: [
    { uri: 'example.com', rel: 'example', title: 'Example Website' },
    { uri: 'example-01.com', rel: 'alternate', title: 'Alternate Example Domain' },
  ]
}

link.parse( '<example-02.com>; rel="alternate"; title="Second Alternate Example Domain"' )
> Link {
  refs: [
    { uri: 'example.com', rel: 'example', title: 'Example Website' },
    { uri: 'example-01.com', rel: 'alternate', title: 'Alternate Example Domain' },
    { uri: 'example-02.com', rel: 'alternate', title: 'Second Alternate Example Domain' },
  ]
}
```

### Handling extended attributes

```js
link.parse( '</extended-attr-example>; rel=start; title*=UTF-8\'en\'%E2%91%A0%E2%93%AB%E2%85%93%E3%8F%A8%E2%99%B3%F0%9D%84%9E%CE%BB' )
```

```js
> Link {
  refs: [
    { uri: '/extended-attr-example', rel: 'start', 'title*': { language: 'en', encoding: null, value: '①⓫⅓㏨♳𝄞λ' } }
  ]
}
```

### Stringifying to HTTP header format

```js
link.toString()
> '<example.com>; rel=example; title="Example Website", <example-01.com>; rel=alternate; title="Alternate Example Domain"'
```

## Speed

```
$ npm run benchmark
```

```
# http-link-header .parse() ⨉ 1000000
ok ~1.29 s (1 s + 289696759 ns)

# http-link-header #toString() ⨉ 1000000
ok ~554 ms (0 s + 553782657 ns)
```
