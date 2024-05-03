export default CumulativeLayoutShift;
/**
 * @fileoverview This metric represents the amount of visual shifting of DOM elements during page load.
 */
declare class CumulativeLayoutShift extends Audit {
    /**
     * @return {LH.Audit.ScoreOptions}
     */
    static get defaultOptions(): import("../../../types/audit.js").default.ScoreOptions;
    /**
     * @param {LH.Artifacts} artifacts
     * @param {LH.Audit.Context} context
     * @return {Promise<LH.Audit.Product>}
     */
    static audit(artifacts: LH.Artifacts, context: LH.Audit.Context): Promise<LH.Audit.Product>;
}
export namespace UIStrings {
    const description: string;
}
import { Audit } from '../audit.js';
//# sourceMappingURL=cumulative-layout-shift.d.ts.map