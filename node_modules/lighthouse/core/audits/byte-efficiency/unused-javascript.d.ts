export default UnusedJavaScript;
export type WasteData = {
    unusedByIndex: Uint8Array;
    unusedLength: number;
    contentLength: number;
};
/**
 * @typedef WasteData
 * @property {Uint8Array} unusedByIndex
 * @property {number} unusedLength
 * @property {number} contentLength
 */
declare class UnusedJavaScript extends ByteEfficiencyAudit {
    /**
     * @param {LH.Artifacts} artifacts
     * @param {Array<LH.Artifacts.NetworkRequest>} networkRecords
     * @param {LH.Audit.Context} context
     * @return {Promise<import('./byte-efficiency-audit.js').ByteEfficiencyProduct>}
     */
    static audit_(artifacts: LH.Artifacts, networkRecords: Array<LH.Artifacts.NetworkRequest>, context: LH.Audit.Context): Promise<import('./byte-efficiency-audit.js').ByteEfficiencyProduct>;
}
export namespace UIStrings {
    const title: string;
    const description: string;
}
import { ByteEfficiencyAudit } from './byte-efficiency-audit.js';
//# sourceMappingURL=unused-javascript.d.ts.map