/**
 * Generate a filenamePrefix of hostname_YYYY-MM-DD_HH-MM-SS.
 * @param {{finalDisplayedUrl: string, fetchTime: string}} lhr
 * @return {string}
 */
export function getLhrFilenamePrefix(lhr: {
    finalDisplayedUrl: string;
    fetchTime: string;
}): string;
/**
 * @fileoverview
 * @suppress {reportUnknownTypes}
 */
/**
 * Generate a filenamePrefix of name_YYYY-MM-DD_HH-MM-SS
 * Date/time uses the local timezone, however Node has unreliable ICU
 * support, so we must construct a YYYY-MM-DD date format manually. :/
 * @param {string} name
 * @param {string|undefined} fetchTime
 */
export function getFilenamePrefix(name: string, fetchTime: string | undefined): string;
/**
 * Generate a filenamePrefix of name_YYYY-MM-DD_HH-MM-SS.
 * @param {{name: string, steps: Array<{lhr: {fetchTime: string}}>}} flowResult
 * @return {string}
 */
export function getFlowResultFilenamePrefix(flowResult: {
    name: string;
    steps: {
        lhr: {
            fetchTime: string;
        };
    }[];
}): string;
//# sourceMappingURL=file-namer.d.ts.map