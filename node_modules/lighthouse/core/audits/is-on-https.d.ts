export default HTTPS;
declare class HTTPS extends Audit {
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
    const columnInsecureURL: string;
    const columnResolution: string;
    const allowed: string;
    const blocked: string;
    const warning: string;
    const upgraded: string;
}
import { Audit } from './audit.js';
//# sourceMappingURL=is-on-https.d.ts.map