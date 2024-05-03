/**
 * Returns an error if the original network request failed or wasn't found.
 * @param {LH.Artifacts.NetworkRequest|undefined} mainRecord
 * @param {{warnings: Array<string | LH.IcuMessage>, ignoreStatusCode?: LH.Config.Settings['ignoreStatusCode']}} context
 * @return {LH.LighthouseError|undefined}
 */
export function getNetworkError(mainRecord: LH.Artifacts.NetworkRequest | undefined, context: {
    warnings: Array<string | LH.IcuMessage>;
    ignoreStatusCode?: LH.Config.Settings['ignoreStatusCode'];
}): LH.LighthouseError | undefined;
/**
 * Returns an error if we ended up on the `chrome-error` page and all other requests failed.
 * @param {LH.Artifacts.NetworkRequest|undefined} mainRecord
 * @param {Array<LH.Artifacts.NetworkRequest>} networkRecords
 * @return {LH.LighthouseError|undefined}
 */
export function getInterstitialError(mainRecord: LH.Artifacts.NetworkRequest | undefined, networkRecords: Array<LH.Artifacts.NetworkRequest>): LH.LighthouseError | undefined;
/**
 * Returns an error if the page load should be considered failed, e.g. from a
 * main document request failure, a security issue, etc.
 * @param {LH.LighthouseError|undefined} navigationError
 * @param {{url: string, ignoreStatusCode?: LH.Config.Settings['ignoreStatusCode'], networkRecords: Array<LH.Artifacts.NetworkRequest>, warnings: Array<string | LH.IcuMessage>}} context
 * @return {LH.LighthouseError|undefined}
 */
export function getPageLoadError(navigationError: LH.LighthouseError | undefined, context: {
    url: string;
    ignoreStatusCode?: boolean | undefined;
    networkRecords: Array<LH.Artifacts.NetworkRequest>;
    warnings: Array<string | LH.IcuMessage>;
}): LH.LighthouseError | undefined;
/**
 * Returns an error if we try to load a non-HTML page.
 * Expects a network request with all redirects resolved, otherwise the MIME type may be incorrect.
 * @param {LH.Artifacts.NetworkRequest|undefined} finalRecord
 * @return {LH.LighthouseError|undefined}
 */
export function getNonHtmlError(finalRecord: LH.Artifacts.NetworkRequest | undefined): LH.LighthouseError | undefined;
export namespace UIStrings {
    const warningXhtml: string;
    const warningStatusCode: string;
}
import { NetworkRequest } from './network-request.js';
import { LighthouseError } from './lh-error.js';
//# sourceMappingURL=navigation-error.d.ts.map