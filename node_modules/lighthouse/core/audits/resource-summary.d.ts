export default ResourceSummary;
export type ResourceType = import('../computed/resource-summary.js').ResourceType;
/** @typedef {import('../computed/resource-summary.js').ResourceType} ResourceType */
declare class ResourceSummary extends Audit {
    /**
     * @param {LH.Artifacts} artifacts
     * @param {LH.Audit.Context} context
     * @return {Promise<LH.Audit.Product>}
     */
    static audit(artifacts: LH.Artifacts, context: LH.Audit.Context): Promise<LH.Audit.Product>;
}
import { Audit } from './audit.js';
//# sourceMappingURL=resource-summary.d.ts.map