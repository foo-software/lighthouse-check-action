export default TotalByteWeight;
declare class TotalByteWeight extends Audit {
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
    const title: string;
    const failureTitle: string;
    const description: string;
    const displayValue: string;
}
import { Audit } from '../audit.js';
//# sourceMappingURL=total-byte-weight.d.ts.map