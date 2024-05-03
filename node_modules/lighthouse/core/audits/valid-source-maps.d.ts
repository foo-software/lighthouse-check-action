export default ValidSourceMaps;
declare class ValidSourceMaps extends Audit {
    /**
     * Returns true if the size of the script exceeds a static threshold.
     * @param {LH.Artifacts.Script} script
     * @param {LH.Artifacts.EntityClassification} classifiedEntities
     * @return {boolean}
     */
    static isLargeFirstPartyJS(script: LH.Artifacts.Script, classifiedEntities: LH.Artifacts.EntityClassification): boolean;
    /**
     * @param {LH.Artifacts} artifacts
     * @param {LH.Audit.Context} context
     */
    static audit(artifacts: LH.Artifacts, context: LH.Audit.Context): Promise<{
        score: number;
        details: import("../../types/lhr/audit-details.js").default.Table;
    }>;
}
export namespace UIStrings {
    const title: string;
    const failureTitle: string;
    const description: string;
    const columnMapURL: string;
    const missingSourceMapErrorMessage: string;
    const missingSourceMapItemsWarningMesssage: string;
}
import { Audit } from './audit.js';
import { EntityClassification } from '../computed/entity-classification.js';
//# sourceMappingURL=valid-source-maps.d.ts.map