# Lighthouse Scores

## How is the Performance score calculated?

➡️ Please read [Lighthouse Performance Scoring at web.dev](https://web.dev/performance-scoring/).

## How is the PWA (Progressive Web App) score calculated?

The PWA category doesn't get a 0-100 score, but instead is evaluated in 3 separate groups (Fast and reliable, Installable, and PWA Optimized). In order to satisfy each grouping (and get the associated badge), every audit within the group must be passing.

![Lighthouse PWA badge - states](https://user-images.githubusercontent.com/39191/80662283-c292d280-8a45-11ea-84e8-7f8248657acf.png)

Note on https redirects: some metrics in this category have issues with https redirects because of TLS-handshake errors. More specifically you will run into this when using the ```simplehttp2server``` npm package. Subsequent metrics will fail after the https redirects (see [#1217](https://github.com/GoogleChrome/lighthouse/issues/1217), [#5910](https://github.com/GoogleChrome/lighthouse/issues/5910)).

## How is the Best Practices score calculated?

All audits in the Best Practices category are equally weighted. Therefore, implementing each audit correctly will increase your overall score by ~6 points.

## How is the SEO score calculated?

All audits in the SEO category are [equally weighted](https://github.com/GoogleChrome/lighthouse/blob/080c6b4b9fec6dfcaf8e0cd8d09c3224465e4fd3/lighthouse-core/config/default-config.js#L531-L547), with the exception ofStructured Data, which is an unscored manual audit. Therefore, implementing each audit correctly will increase your overall score by ~8 points.


## How is the accessibility score calculated?

<!-- To regnerate score weights, run `node lighthouse-core/scripts/print-a11y-scoring.js`-->

The accessibility score is a weighted average. The specific weights for v7 are as follows:

(See the [v6 scoring explanation](https://github.com/GoogleChrome/lighthouse/blob/v6.5.0/docs/scoring.md#how-is-the-accessibility-score-calculated))

| audit id | weight |
|-|-|
 | aria-allowed-attr | 4.1% |
 | aria-hidden-body | 4.1% |
 | aria-required-attr | 4.1% |
 | aria-required-children | 4.1% |
 | aria-required-parent | 4.1% |
 | aria-roles | 4.1% |
 | aria-valid-attr-value | 4.1% |
 | aria-valid-attr | 4.1% |
 | button-name | 4.1% |
 | duplicate-id-aria | 4.1% |
 | image-alt | 4.1% |
 | input-image-alt | 4.1% |
 | label | 4.1% |
 | meta-refresh | 4.1% |
 | meta-viewport | 4.1% |
 | video-caption | 4.1% |
 | accesskeys | 1.2% |
 | aria-command-name | 1.2% |
 | aria-hidden-focus | 1.2% |
 | aria-input-field-name | 1.2% |
 | aria-meter-name | 1.2% |
 | aria-progressbar-name | 1.2% |
 | aria-toggle-field-name | 1.2% |
 | aria-tooltip-name | 1.2% |
 | aria-treeitem-name | 1.2% |
 | bypass | 1.2% |
 | color-contrast | 1.2% |
 | definition-list | 1.2% |
 | dlitem | 1.2% |
 | document-title | 1.2% |
 | duplicate-id-active | 1.2% |
 | frame-title | 1.2% |
 | html-has-lang | 1.2% |
 | html-lang-valid | 1.2% |
 | link-name | 1.2% |
 | list | 1.2% |
 | listitem | 1.2% |
 | object-alt | 1.2% |
 | tabindex | 1.2% |
 | td-headers-attr | 1.2% |
 | th-has-data-cells | 1.2% |
 | valid-lang | 1.2% |
 | form-field-multiple-labels | 0.8% |
 | heading-order | 0.8% |

Each audit is a pass/fail, meaning there is no room for partial points for getting an audit half-right. For example, that means if half your buttons have screenreader friendly names, and half do not, you don't get "half" of the weighted average - you get a 0 because it needs to be implemented correctly *throughout* the page.
