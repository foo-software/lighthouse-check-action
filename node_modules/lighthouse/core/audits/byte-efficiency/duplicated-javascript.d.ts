export default DuplicatedJavascript;
export type ByteEfficiencyProduct = import('./byte-efficiency-audit.js').ByteEfficiencyProduct;
export type Item = LH.Audit.ByteEfficiencyItem & {
    source: string;
    subItems: {
        type: 'subitems';
        items: SubItem[];
    };
};
export type SubItem = {
    url: string;
    sourceTransferBytes?: number;
};
declare class DuplicatedJavascript extends ByteEfficiencyAudit {
    /**
     * @param {string} source
     */
    static _getNodeModuleName(source: string): string;
    /**
     * @param {LH.Artifacts} artifacts
     * @param {LH.Audit.Context} context
     */
    static _getDuplicationGroupedByNodeModules(artifacts: LH.Artifacts, context: LH.Audit.Context): Promise<Map<string, {
        scriptId: string;
        scriptUrl: string;
        resourceSize: number;
    }[]>>;
    /**
     * This audit highlights JavaScript modules that appear to be duplicated across all resources,
     * either within the same bundle or between different bundles. Each details item returned is
     * a module with subItems for each resource that includes it. The wastedBytes for the details
     * item is the number of bytes occupied by the sum of all but the largest copy of the module.
     * wastedBytesByUrl attributes the cost of the bytes to a specific resource, for use by lantern.
     * @param {LH.Artifacts} artifacts
     * @param {Array<LH.Artifacts.NetworkRequest>} networkRecords
     * @param {LH.Audit.Context} context
     * @return {Promise<ByteEfficiencyProduct>}
     */
    static audit_(artifacts: LH.Artifacts, networkRecords: Array<LH.Artifacts.NetworkRequest>, context: LH.Audit.Context): Promise<ByteEfficiencyProduct>;
}
export namespace UIStrings {
    const title: string;
    const description: string;
}
import { ByteEfficiencyAudit } from './byte-efficiency-audit.js';
//# sourceMappingURL=duplicated-javascript.d.ts.map