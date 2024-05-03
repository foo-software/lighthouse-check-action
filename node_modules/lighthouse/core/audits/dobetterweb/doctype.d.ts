export default Doctype;
declare class Doctype extends Audit {
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
    const explanationNoDoctype: string;
    const explanationWrongDoctype: string;
    const explanationLimitedQuirks: string;
    const explanationPublicId: string;
    const explanationSystemId: string;
    const explanationBadDoctype: string;
}
import { Audit } from '../audit.js';
//# sourceMappingURL=doctype.d.ts.map