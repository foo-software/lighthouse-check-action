export default Deprecations;
declare class Deprecations extends Audit {
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
    const columnDeprecate: string;
    const columnLine: string;
}
import { Audit } from './audit.js';
//# sourceMappingURL=deprecations.d.ts.map