[![ISC License](https://img.shields.io/npm/l/make-plural.svg)](http://en.wikipedia.org/wiki/ISC_license)
[![Build Status](https://travis-ci.org/eemeli/make-plural.svg?branch=master)](https://travis-ci.org/eemeli/make-plural)


make-plural
===========

Make-plural is a JavaScript module that translates [Unicode CLDR] pluralization
[rules] to JavaScript functions. It includes both a live parser as well as the
generated output for the latest edition of the CLDR; the latter is just over 2kB
in size when minified & gzipped and covers 199 languages, so it's probably what
you want unless you really know what you're doing.

Make-plural is written in [ECMAScript 6] and transpiled using [Babel] and
[Browserify] to CommonJS and AMD and ES6 module formats, as well as being
suitable for use in browser environments.

[Unicode CLDR]: http://cldr.unicode.org/
[rules]: http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html
[ECMAScript 6]: https://people.mozilla.org/~jorendorff/es6-draft.html
[Babel]: https://babeljs.io/
[Browserify]: http://browserify.org/


## Installation

```
npm install make-plural
```
_or_
```
bower install make-plural
```
_or_
```
git clone https://github.com/eemeli/make-plural.git
cd make-plural
npm install
make all
```
_or_ download the latest release from
[here](https://github.com/eemeli/make-plural/releases/latest)


## Precompiled plurals

`umd/plurals.js` contains an UMD module that can be included with node's
`require` or AMD's `define`. In a browser environment, it will populate a global
object `plurals`. Said module contains 199 functions (one per [language][rules]),
each taking as a first parameter the value to be classified (either a number or
a string), and as an optional second parameter, a boolean that if true, applies
ordinal rather than cardinal rules.

`umd/pluralCategories.js` has a similar structure to `umd/plurals.js`, but
contains an array of the pluralization categories the cardinal and ordinal rules
each language's pluralization function may output.

`es6/plurals.js` and `es6/pluralCategories.js` are the ES6 module equivalents of
the above.

If your language isn't directly included in either of the above, try removing
any trailing parts that are separated from the stem by `-` or `_`. Note also
that the [capitalization of locale codes] is lowercase for the language, but
uppercase for the country, so for example the code for Portugese as spoken in
Portugal is `pt-PT`.

[capitalization of locale codes]: https://tools.ietf.org/html/bcp47#section-2.1.1


### Precompiled use: Node

```js
var plurals = require('make-plural')
// { af: [Function],
//   ak: [Function],
//   am: [Function],
// snip 193 lines...
//   yo: [Function],
//   zh: [Function],
//   zu: [Function] }

plurals.en(1)  // 1st param is the value
// 'one'

plurals.en(2)
// 'other'

plurals.en(2, true)  // 2nd param, if true-ish, is for ordinal rules
// 'two'

console.log(plurals.en.toString())
// function (n, ord) {
//   var s = String(n).split('.'), v0 = !s[1], t0 = Number(s[0]) == n,
//       n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
//   if (ord) return (n10 == 1 && n100 != 11) ? 'one'
//       : (n10 == 2 && n100 != 12) ? 'two'
//       : (n10 == 3 && n100 != 13) ? 'few'
//       : 'other';
//   return (n == 1 && v0) ? 'one' : 'other';
// }

var pluralCategories = require('make-plural/umd/pluralCategories')
// { af: { cardinal: [ 'one', 'other' ], ordinal: [ 'other' ] },
//   ak: { cardinal: [ 'one', 'other' ], ordinal: [ 'other' ] },
//   am: { cardinal: [ 'one', 'other' ], ordinal: [ 'other' ] },
//   ar:
//    { cardinal: [ 'zero', 'one', 'two', 'few', 'many', 'other' ],
//      ordinal: [ 'other' ] },
// snip 255 lines...
//   zh: { cardinal: [ 'other' ], ordinal: [ 'other' ] },
//   zu: { cardinal: [ 'one', 'other' ], ordinal: [ 'other' ] } }
```

### Precompiled use: Web

```html
<script src="path/to/make-plural/umd/plurals.js"></script>
<script>
  var ru = plurals.ru
  console.log('1: ' + plurals.ru(1) + ', 3.0: ' + plurals.ru(3.0) +
              ', "1.0": ' + plurals.ru('1.0') + ', "0": ' + plurals.ru('0'));
  console.log(plurals.ru.toString());
</script>
```
With outputs:
```
1: one, 3.0: few, "1.0": other, "0": many

function(n, ord) {
  var s = String(n).split('.'), i = s[0], v0 = !s[1], i10 = i.slice(-1),
      i100 = i.slice(-2);
  if (ord) return 'other';
  return (v0 && i10 == 1 && i100 != 11) ? 'one'
      : (v0 && (i10 >= 2 && i10 <= 4) && (i100 < 12
          || i100 > 14)) ? 'few'
      : (v0 && i10 == 0 || v0 && (i10 >= 5 && i10 <= 9)
          || v0 && (i100 >= 11 && i100 <= 14)) ? 'many'
      : 'other';
}
```

Note that with `umd/plurals.min.js`, the stringified function would be rendered
as:
```js
function (e,t){var r=String(e).split("."),n=r[0],o=!r[1],c=n.slice(-1),
i=n.slice(-2);return t?"other":o&&1==c&&11!=i?"one":o&&c>=2&&4>=c&&(12>i||i>14)?
"few":o&&0==c||o&&c>=5&&9>=c||o&&i>=11&&14>=i?"many":"other"}
```


## Live compiler: `make-plural.js`

### MakePlural.load(cldr, ...)
Loads CLDR rules from one or more `cldr` variables, each of which must be an
object formatted like [this][json].

No plural data is included by default, so you'll need to call this at least
once, or otherwise fill the `MakePlural.rules` object.

The default CLDR rules are included in make-plural, and may be loaded as seen
in the examples below.

[json]: https://github.com/unicode-cldr/cldr-core/blob/master/supplemental/plurals.json


### new MakePlural(lc, { cardinals, ordinals })
Returns a function that takes an argument `n` and returns its plural category
for the given locale `lc`. If no direct match for `lc` is found, it is compared
case-insensitively to known locales.

The returned function has an overloaded `toString(name)` method that may be
used to generate a clean string representation of the function, with an
optional name `name`.

The optional second parameter may contain the following boolean members:
* `cardinals` — if true, rules for cardinal values (1 day, 2 days, etc.) are 
  included
* `ordinals` — if true, rules for ordinal values (1st, 2nd, etc.) are included

If both `cardinals` and `ordinals` are true, the returned function takes a
second parameter `ord`. Then, if `ord` is true, the function will return the
ordinal rather than cardinal category applicable to `n` in locale `lc`.

If the second parameter is undefined, the values are taken from
`MakePlural.cardinals` (default `true`) and `MakePlural.ordinals` (default
`false`).


### Live use: Node

```js
var MakePlural = require('make-plural/make-plural').load(
    require('make-plural/data/plurals.json'),
    require('make-plural/data/ordinals.json'))
// { [Function: MakePlural]
//   cardinals: true,
//   ordinals: false,
//   rules:
//    { cardinal:
//       { af: [Object],
//         ak: [Object],
//         am: [Object],
// snip 193 lines...
//         yo: [Object],
//         zh: [Object],
//         zu: [Object] },
//      ordinal:
//       { af: [Object],
//         am: [Object],
//         ar: [Object],
// snip 78 lines...
//         vi: [Object],
//         zh: [Object],
//         zu: [Object] } } }

var sk = new MakePlural('sk')  // Note: not including ordinals by default
// { [Function]
//   _obj:
//    { lc: 'sk',
//      cardinals: true,
//      ordinals: false,
//      categories: { cardinal: [Object], ordinal: [] },
//      parser: { v0: 1, i: 1 },
//      tests: { obj: [Circular], ordinal: {}, cardinal: [Object] },
//      fn: [Circular] },
//   categories: { cardinal: [ 'one', 'few', 'many', 'other' ], ordinal: [] },
//   test: [Function],
//   toString: [Function] }

sk(1)
// 'one'

sk(3.0)
// 'few'

sk('1.0')
// 'many'

sk('0')
// 'other'

console.log(sk.toString())
// function(n) {
//   var s = String(n).split('.'), i = s[0], v0 = !s[1];
//   return (i == 1 && v0 ) ? 'one'
//       : ((i >= 2 && i <= 4) && v0 ) ? 'few'
//       : (!v0   ) ? 'many'
//       : 'other';
// }
```

`make-plural` may also be used in browser environments; see `test/index.html`
for an example of its use.


## CLI Usage

```sh
$ ./bin/make-plural > plurals.js

$ ./bin/make-plural fr
function fr(n, ord) {
  if (ord) return (n == 1) ? 'one' : 'other';
  return (n >= 0 && n < 2) ? 'one' : 'other';
}

$ ./bin/make-plural --locale fr --value 1.5
one

$ ./bin/make-plural 1.5 -l fr --ordinal
other
```

Please see the source of `src/index.js` for more details.



## Dependencies

Make-plural has no required runtime dependencies. CLDR plural rule data is
included in JSON format; make-plural supports the [LDML Language Plural Rules]
as used in CLDR release 24 and later.

The CLI binary `bin/make-plural` does use [minimist] as an argument parser, but
that is not required for any other use.

Using `MakePlural.load()`, you may make use of external sources of CLDR data.
For example, the following works when using together with [cldr-data]:
```js
var cldr = require('cldr-data');
var MakePlural = require('make-plural/make-plural').load(
  cldr('supplemental/plurals'),
  cldr('supplemental/ordinals')
);
var en = new MakePlural('en');
en(3, true);
// 'few'
```

[LDML Language Plural Rules]: http://unicode.org/reports/tr35/tr35-numbers.html#Language_Plural_Rules
[minimist]: https://www.npmjs.com/package/minimist
[cldr-data]: https://www.npmjs.org/package/cldr-data
