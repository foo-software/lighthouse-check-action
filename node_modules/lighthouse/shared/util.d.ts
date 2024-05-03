export type SnippetValue = import('../types/lhr/audit-details').default.SnippetValue;
export class Util {
    static get RATINGS(): {
        PASS: {
            label: string;
            minScore: number;
        };
        AVERAGE: {
            label: string;
            minScore: number;
        };
        FAIL: {
            label: string;
        };
        ERROR: {
            label: string;
        };
    };
    static get PASS_THRESHOLD(): number;
    static get MS_DISPLAY_VALUE(): string;
    /**
     * If LHR is older than 10.0 it will not have the `finalDisplayedUrl` property.
     * Old LHRs should have the `finalUrl` property which will work fine for the report.
     *
     * @param {LH.Result} lhr
     */
    static getFinalDisplayedUrl(lhr: LH.Result): string;
    /**
     * If LHR is older than 10.0 it will not have the `mainDocumentUrl` property.
     * Old LHRs should have the `finalUrl` property which is the same as `mainDocumentUrl`.
     *
     * @param {LH.Result} lhr
     */
    static getMainDocumentUrl(lhr: LH.Result): string | undefined;
    /**
     * @param {LH.Result} lhr
     * @return {LH.Result.FullPageScreenshot=}
     */
    static getFullPageScreenshot(lhr: LH.Result): LH.Result.FullPageScreenshot | undefined;
    /**
     * Given the entity classification dataset and a URL, identify the entity.
     * @param {string} url
     * @param {LH.Result.Entities=} entities
     * @return {LH.Result.LhrEntity|string}
     */
    static getEntityFromUrl(url: string, entities?: LH.Result.Entities | undefined): LH.Result.LhrEntity | string;
    /**
     * Split a string by markdown code spans (enclosed in `backticks`), splitting
     * into segments that were enclosed in backticks (marked as `isCode === true`)
     * and those that outside the backticks (`isCode === false`).
     * @param {string} text
     * @return {Array<{isCode: true, text: string}|{isCode: false, text: string}>}
     */
    static splitMarkdownCodeSpans(text: string): Array<{
        isCode: true;
        text: string;
    } | {
        isCode: false;
        text: string;
    }>;
    /**
     * Split a string on markdown links (e.g. [some link](https://...)) into
     * segments of plain text that weren't part of a link (marked as
     * `isLink === false`), and segments with text content and a URL that did make
     * up a link (marked as `isLink === true`).
     * @param {string} text
     * @return {Array<{isLink: true, text: string, linkHref: string}|{isLink: false, text: string}>}
     */
    static splitMarkdownLink(text: string): Array<{
        isLink: true;
        text: string;
        linkHref: string;
    } | {
        isLink: false;
        text: string;
    }>;
    /**
     * @param {string} string
     * @param {number} characterLimit
     * @param {string} ellipseSuffix
     */
    static truncate(string: string, characterLimit: number, ellipseSuffix?: string): string;
    /**
     * @param {URL} parsedUrl
     * @param {{numPathParts?: number, preserveQuery?: boolean, preserveHost?: boolean}=} options
     * @return {string}
     */
    static getURLDisplayName(parsedUrl: URL, options?: {
        numPathParts?: number | undefined;
        preserveQuery?: boolean | undefined;
        preserveHost?: boolean | undefined;
    } | undefined): string;
    /**
     * Returns the origin portion of a Chrome extension URL.
     * @param {string} url
     * @return {string}
     */
    static getChromeExtensionOrigin(url: string): string;
    /**
     * Split a URL into a file, hostname and origin for easy display.
     * @param {string} url
     * @return {{file: string, hostname: string, origin: string}}
     */
    static parseURL(url: string): {
        file: string;
        hostname: string;
        origin: string;
    };
    /**
     * @param {string|URL} value
     * @return {!URL}
     */
    static createOrReturnURL(value: string | URL): URL;
    /**
     * Gets the tld of a domain
     * This function is used only while rendering pre-10.0 LHRs.
     *
     * @param {string} hostname
     * @return {string} tld
     */
    static getPseudoTld(hostname: string): string;
    /**
     * Returns a primary domain for provided hostname (e.g. www.example.com -> example.com).
     * As it doesn't consult the Public Suffix List, it can sometimes lose detail.
     * See the `listOfTlds` comment above for more.
     * This function is used only while rendering pre-10.0 LHRs. See UrlUtils.getRootDomain
     * for the current method that makes use of PSL.
     * @param {string|URL} url hostname or URL object
     * @return {string}
     */
    static getPseudoRootDomain(url: string | URL): string;
    /**
     * Returns only lines that are near a message, or the first few lines if there are
     * no line messages.
     * @param {SnippetValue['lines']} lines
     * @param {SnippetValue['lineMessages']} lineMessages
     * @param {number} surroundingLineCount Number of lines to include before and after
     * the message. If this is e.g. 2 this function might return 5 lines.
     */
    static filterRelevantLines(lines: SnippetValue['lines'], lineMessages: SnippetValue['lineMessages'], surroundingLineCount: number): {
        content: string;
        lineNumber: number;
        truncated?: boolean | undefined;
    }[];
    /**
     * Computes a score between 0 and 1 based on the measured `value`. Score is determined by
     * considering a log-normal distribution governed by two control points (the 10th
     * percentile value and the median value) and represents the percentage of sites that are
     * greater than `value`.
     *
     * Score characteristics:
     * - within [0, 1]
     * - rounded to two digits
     * - value must meet or beat a controlPoint value to meet or exceed its percentile score:
     *   - value > median will give a score < 0.5; value ≤ median will give a score ≥ 0.5.
     *   - value > p10 will give a score < 0.9; value ≤ p10 will give a score ≥ 0.9.
     * - values < p10 will get a slight boost so a score of 1 is achievable by a
     *   `value` other than those close to 0. Scores of > ~0.99524 end up rounded to 1.
     * @param {{median: number, p10: number}} controlPoints
     * @param {number} value
     * @return {number}
     */
    static computeLogNormalScore(controlPoints: {
        median: number;
        p10: number;
    }, value: number): number;
}
//# sourceMappingURL=util.d.ts.map