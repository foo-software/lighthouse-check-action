export default PastePreventingInputsAudit;
declare class PastePreventingInputsAudit extends Audit {
    /**
     * @param {LH.Artifacts} artifacts
     * @return {LH.Audit.Product}
     */
    static audit(artifacts: LH.Artifacts): LH.Audit.Product;
}
export namespace UIStrings {
    const title: string;
    const failureTitle: string;
    const description: string;
}
import { Audit } from '../audit.js';
//# sourceMappingURL=paste-preventing-inputs.d.ts.map