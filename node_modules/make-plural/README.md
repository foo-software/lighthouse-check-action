# make-plural

`make-plural` provides JavaScript functions determining the pluralization categories of the approximately 200 languages included in the [Unicode CLDR]. In addition to the more commonly considered cardinal plurals (e.g. one book, two books), it also support ordinal plurals (e.g. 1st book, 2nd book, etc). It's used internally by the [intl-pluralrules] polyfill.

The categorization functions are pre-compiled, require no runtime dependencies, and should compress to about 2.5kB. The ES module exports in particular are designed to work well with tree-shaking, allowing for further size savings. In order to generate an even smaller file from a subset of all possible language (or to drop ordinal plural support), use [make-plural-cli] or [make-plural-compiler].

[intl-pluralrules]: https://www.npmjs.com/package/intl-pluralrules
[unicode cldr]: http://cldr.unicode.org/
[make-plural-cli]: https://www.npmjs.com/package/make-plural-cli
[make-plural-compiler]: https://www.npmjs.com/package/make-plural-compiler

## Installation & Usage

```
npm install make-plural
```

```js
import * as Plurals from 'make-plural/plurals' // or just 'make-plural'
import * as Cardinals from 'make-plural/cardinals'
import * as Ordinals from 'make-plural/ordinals'
import * as Categories from 'make-plural/pluralCategories'
```

Each of the endpoints is available with both UMD (.js) and ES (.mjs) packaging. `Cardinals`, `Ordinals` and `Plurals` each export a set of functions keyed by locale code, returning the pluralization category for the input (either a number or a string representation of a number). `Plurals` functions also accept a second boolean parameter to return the ordinal (`true`) rather than cardinal (`false`, default) plural category. Note that `Ordinals` includes a slightly smaller subset of locales than `Cardinals` and `Plurals`, due to a lack of data in the CLDR.

`Categories` has a similar structure, but contains for each language an array of the pluralization categories the cardinal and ordinal rules that that language's pluralization function may output.

The object keys are named using the corresponding 2-3 character [language code]. Due to JavaScript identifier restrictions, there are two exceptions: Portugese as spoken in Portugal (`pt-PT`; `pt` is Brazilian Portuguese) is available as `pt_PT`, and the now-deprecated `in` subtag for Indonesian (preferred: `id`) is available as `_in`. The transformation used for these names is available as [safe-identifier] on npm.

[language]: http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html
[language code]: https://www.unicode.org/cldr/charts/latest/supplemental/languages_and_scripts.html
[safe-identifier]: https://www.npmjs.com/package/safe-identifier

The package file paths and exports are structured in a manner that should allow transparent usage in any module system. In particular, when importing as an ES6 module, tree shaking should be able drop all but the explicitly used functions from the output, provided that **named rather than wildcard imports** are used.

```js
import { en } from 'make-plural'

en(1) // 'one'
en('1.0') // 'other'
en(2) // 'other'
en(2, true) // 'two' (ordinal)

String(en)
// function en(n, ord) {
//   var s = String(n).split('.'), v0 = !s[1], t0 = Number(s[0]) == n,
//       n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
//   if (ord) return (n10 == 1 && n100 != 11) ? 'one'
//       : (n10 == 2 && n100 != 12) ? 'two'
//       : (n10 == 3 && n100 != 13) ? 'few'
//       : 'other';
//   return (n == 1 && v0) ? 'one' : 'other';
// }

import { en as ordinalEn } from 'make-plural/ordinals'

ordinalEn(3) // 'few'

import * as Categories from 'make-plural/pluralCategories'
// { _in: { cardinal: [ 'other' ], ordinal: [ 'other' ] },
//   af: { cardinal: [ 'one', 'other' ], ordinal: [ 'other' ] },
//   ak: { cardinal: [ 'one', 'other' ], ordinal: [ 'other' ] },
//   am: { cardinal: [ 'one', 'other' ], ordinal: [ 'other' ] },
//   ar:
//    { cardinal: [ 'zero', 'one', 'two', 'few', 'many', 'other' ],
//      ordinal: [ 'other' ] },
// ...
//   en: {
//       cardinal: [ 'one', 'other' ],
//       ordinal: [ 'one', 'two', 'few', 'other' ]
//     },
// ...
//   zh: { cardinal: [ 'other' ], ordinal: [ 'other' ] },
//   zu: { cardinal: [ 'one', 'other' ], ordinal: [ 'other' ] } }
```
