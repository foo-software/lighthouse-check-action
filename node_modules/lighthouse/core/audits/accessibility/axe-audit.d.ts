export default AxeAudit;
declare class AxeAudit extends Audit {
    /**
     * Base class for audit rules which reflect assessment performed by the aXe accessibility library
     * See https://github.com/dequelabs/axe-core/blob/6b444546cff492a62a70a74a8fc3c62bd4729400/doc/API.md#results-object for result type and format details
     *
     * @param {LH.Artifacts} artifacts Accessibility gatherer artifacts. Note that AxeAudit
     * expects the meta name for the class to match the rule id from aXe.
     * @return {LH.Audit.Product}
     */
    static audit(artifacts: LH.Artifacts): LH.Audit.Product;
}
export namespace UIStrings {
    const failingElementsHeader: string;
}
import { Audit } from '../audit.js';
//# sourceMappingURL=axe-audit.d.ts.map