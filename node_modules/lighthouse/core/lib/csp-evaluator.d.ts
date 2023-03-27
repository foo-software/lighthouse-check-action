export type Finding = import('csp_evaluator/finding').Finding;
/**
 * @param {Finding} finding
 * @return {LH.IcuMessage|string}
 */
export function getTranslatedDescription(finding: Finding): LH.IcuMessage | string;
/**
 * @param {string[]} rawCsps
 * @return {{bypasses: Finding[], warnings: Finding[], syntax: Finding[][]}}
 */
export function evaluateRawCspsForXss(rawCsps: string[]): {
    bypasses: Finding[];
    warnings: Finding[];
    syntax: Finding[][];
};
/**
 * @param {string} rawCsp
 */
export function parseCsp(rawCsp: string): import("csp_evaluator/dist/csp.js").Csp;
export namespace UIStrings {
    const missingBaseUri: string;
    const missingScriptSrc: string;
    const missingObjectSrc: string;
    const strictDynamic: string;
    const unsafeInline: string;
    const unsafeInlineFallback: string;
    const allowlistFallback: string;
    const reportToOnly: string;
    const reportingDestinationMissing: string;
    const nonceLength: string;
    const nonceCharset: string;
    const missingSemicolon: string;
    const unknownDirective: string;
    const unknownKeyword: string;
    const deprecatedReflectedXSS: string;
    const deprecatedReferrer: string;
    const deprecatedDisownOpener: string;
    const plainWildcards: string;
    const plainUrlScheme: string;
}
//# sourceMappingURL=csp-evaluator.d.ts.map