export default Description;
declare class Description extends Audit {
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
    const explanation: string;
}
import { Audit } from '../audit.js';
//# sourceMappingURL=meta-description.d.ts.map