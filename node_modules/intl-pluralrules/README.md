# intl-pluralrules

A spec-compliant implementation & polyfill for [Intl.PluralRules]. Particularly
useful if you need proper support for [`minimumFractionDigits`], which are only
supported in Chrome 77 & later.

[intl.pluralrules]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/PluralRules
[`minimumfractiondigits`]: https://bugs.chromium.org/p/v8/issues/detail?id=8866

## Installation

```
npm install intl-pluralrules
```

## Polyfill

To use as a polyfill, just import it to ensure that `Intl.PluralRules` is
available in your environment:

```js
import 'intl-pluralrules'
```

If `Intl.PluralRules` already exists and supports
[multiple locales](https://nodejs.org/api/intl.html), the polyfill will not be
loaded. Full support for `minimumFractionDigits` is not checked.

## Ponyfill

A complete implementation of PluralRules is available as
`intl-pluralrules/plural-rules`, if you'd prefer using it without modifying your
`Intl` object, or if you wish to use it rather than your environment's own:

```js
import PluralRules from 'intl-pluralrules/plural-rules'

new PluralRules('en').select(1) // 'one'
new PluralRules('en', { minimumSignificantDigits: 3 }).select(1) // 'other'
```

## Factory

In order to support all available locales, their data needs to be included in
the package. This means that when minified and gzipped, the above-documented
usage adds about 7kB to your application's production size. If this is a
concern, you can use `intl-pluralrules/factory` and [make-plural] to build a
PluralRules class with locale support limited to only what you actually use.

[make-plural]: https://www.npmjs.com/package/make-plural

Thanks to tree-shaking, this example that only supports English and French
minifies & gzips to 1619 bytes. Do note that this size difference is only
apparent with minified production builds.

```js
import getPluralRules from 'intl-pluralrules/factory'
import { en, fr } from 'make-plural/plurals'
import { en as enCat, fr as frCat } from 'make-plural/pluralCategories'

const sel = { en, fr }
const getSelector = lc => sel[lc]

const cat = { en: enCat, fr: frCat }
const getCategories = (lc, ord) => cat[lc][ord ? 'ordinal' : 'cardinal']

const PluralRules = getPluralRules(
  Intl.NumberFormat, // Not available in IE 10
  getSelector,
  getCategories
)
export default PluralRules
```

All arguments of `getPluralRules(NumberFormat, getSelector, getCategories)` are
required.

- `NumberFormat` should be `Intl.NumberFormat`, or a minimal implementation
  such as the one available at `intl-pluralrules/pseudo-number-format`. It
  should at least support the `"en"` locale and all of the min/max digit count
  options.
- `getSelector(lc)` should return a `function(n, ord)` returning the plural
  category of `n`, using cardinal plural rules (by default), or ordinal rules if
  `ord` is true. `n` may be a number, or the formatted string representation of
  a number. This may be called with any user-provided string `lc`, and should
  return `undefined` for invalid or unsupported locales.
- `getCategories(lc, ord)` should return the set of available plural categories
  for the locale, either for cardinals (by default), or ordinals if `ord` is
  true. This function will be called only with values for which `getSelector`
  returns a function.
