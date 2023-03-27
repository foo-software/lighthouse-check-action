/**
 * @fileoverview Use the lhr.i18n.icuMessagePaths object to change locales.
 *
 * `icuMessagePaths` is an object keyed by `LH.IcuMessage['i18nId']`s. Within each is either
 * 1) an array of strings, which are just object paths to where that message is used in the LHR
 * 2) an array of `LH.IcuMessagePath`s which include both a `path` and a `values` object
 *    which will be used in the replacement within `format.getFormatted()`
 *
 * An example:
    "icuMessagePaths": {
    "core/audits/metrics/first-contentful-paint.js | title": [
      "audits[first-contentful-paint].title"
    ],
    "core/audits/server-response-time.js | displayValue": [
      {
        "values": {
          "timeInMs": 570.5630000000001
        },
        "path": "audits[server-response-time].displayValue"
      }
    ],
    "core/lib/i18n/i18n.js | columnTimeSpent": [
      "audits[mainthread-work-breakdown].details.headings[1].text",
      "audits[network-rtt].details.headings[1].text",
      "audits[network-server-latency].details.headings[1].text"
    ],
    ...
 */
/**
 * Returns a new LHR with all strings changed to the new `requestedLocale`.
 * @param {LH.Result} lhr
 * @param {LH.Locale} requestedLocale
 * @return {{lhr: LH.Result, missingIcuMessageIds: string[]}}
 */
export function swapLocale(lhr: LH.Result, requestedLocale: LH.Locale): {
    lhr: LH.Result;
    missingIcuMessageIds: string[];
};
//# sourceMappingURL=swap-locale.d.ts.map