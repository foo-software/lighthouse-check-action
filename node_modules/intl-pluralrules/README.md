# intl-pluralrules

A spec-compliant polyfill for [Intl.PluralRules]. Particularly useful if you
need proper support for [`minimumFractionDigits`].

[intl.pluralrules]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/PluralRules
[`minimumfractiondigits`]: https://bugs.chromium.org/p/v8/issues/detail?id=8866

## Installation

```
npm install intl-pluralrules
```

## Usage

To use the polyfill, just import it to make sure that a fully functional
`Intl.PluralRules` is available in your environment:

```js
import 'intl-pluralrules'
```

If `Intl.PluralRules` already exists and supports
[multiple locales](https://nodejs.org/api/intl.html), the polyfill will not be
loaded.

The implementation itself is available as
`intl-pluralrules/plural-rules`, if you'd prefer using it without modifying your
`Intl` object, or if you wish to use it rather than your environment's own:

```js
import PluralRules from 'intl-pluralrules/plural-rules'

new PluralRules('en').select(1) // 'one'
new PluralRules('en', { minimumSignificantDigits: 3 }).select(1) // 'other'
```
