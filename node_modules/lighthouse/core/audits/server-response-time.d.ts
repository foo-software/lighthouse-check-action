export default ServerResponseTime;
declare class ServerResponseTime extends Audit {
    /**
     * @param {LH.Artifacts.NetworkRequest} record
     * @return {number|null}
     */
    static calculateResponseTime(record: LH.Artifacts.NetworkRequest): number | null;
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
import { Audit } from './audit.js';
//# sourceMappingURL=server-response-time.d.ts.map