export default NetworkRTT;
declare class NetworkRTT extends Audit {
    /**
     * @param {LH.Artifacts} artifacts
     * @param {LH.Audit.Context} context
     * @return {Promise<LH.Audit.Product>}
     */
    static audit(artifacts: LH.Artifacts, context: LH.Audit.Context): Promise<LH.Audit.Product>;
}
export namespace UIStrings {
    const title: string;
    const description: string;
}
import { Audit } from './audit.js';
//# sourceMappingURL=network-rtt.d.ts.map