export default UnminifiedCSS;
/**
 * @fileOverview
 */
declare class UnminifiedCSS extends ByteEfficiencyAudit {
    /**
     * Computes the total length of the meaningful tokens (CSS excluding comments and whitespace).
     *
     * @param {string} content
     * @return {number}
     */
    static computeTokenLength(content: string): number;
    /**
     * @param {LH.Artifacts.CSSStyleSheetInfo} stylesheet
     * @param {LH.Artifacts.NetworkRequest|undefined} networkRecord
     * @return {{url: string, totalBytes: number, wastedBytes: number, wastedPercent: number}}
     */
    static computeWaste(stylesheet: LH.Artifacts.CSSStyleSheetInfo, networkRecord: LH.Artifacts.NetworkRequest | undefined): {
        url: string;
        totalBytes: number;
        wastedBytes: number;
        wastedPercent: number;
    };
    /**
     * @param {LH.Artifacts} artifacts
     * @param {Array<LH.Artifacts.NetworkRequest>} networkRecords
     * @return {import('./byte-efficiency-audit.js').ByteEfficiencyProduct}
     */
    static audit_(artifacts: LH.Artifacts, networkRecords: Array<LH.Artifacts.NetworkRequest>): import('./byte-efficiency-audit.js').ByteEfficiencyProduct;
}
export namespace UIStrings {
    const title: string;
    const description: string;
}
import { ByteEfficiencyAudit } from './byte-efficiency-audit.js';
//# sourceMappingURL=unminified-css.d.ts.map