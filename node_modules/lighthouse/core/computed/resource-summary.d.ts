export { ResourceSummaryComputed as ResourceSummary };
export type ResourceEntry = {
    count: number;
    resourceSize: number;
    transferSize: number;
};
export type ResourceType = 'stylesheet' | 'image' | 'media' | 'font' | 'script' | 'document' | 'other' | 'third-party' | 'total';
declare const ResourceSummaryComputed: typeof ResourceSummary & {
    request: (dependencies: {
        URL: LH.Artifacts['URL'];
        devtoolsLog: import("../index.js").DevtoolsLog;
    }, context: import("../../types/utility-types.js").default.ImmutableObject<{
        computedCache: Map<string, import("../lib/arbitrary-equality-map.js").ArbitraryEqualityMap>;
    }>) => Promise<Record<ResourceType, ResourceEntry>>;
};
/** @typedef {{count: number, resourceSize: number, transferSize: number}} ResourceEntry */
/** @typedef {'stylesheet'|'image'|'media'|'font'|'script'|'document'|'other'|'third-party'|'total'} ResourceType */
declare class ResourceSummary {
    /**
     * @param {LH.Artifacts.NetworkRequest} record
     * @return {ResourceType}
     */
    static determineResourceType(record: LH.Artifacts.NetworkRequest): ResourceType;
    /**
     * @param {Array<LH.Artifacts.NetworkRequest>} networkRecords
     * @param {LH.Artifacts.URL} URLArtifact
     * @param {LH.Artifacts.EntityClassification} classifiedEntities
     * @return {Record<ResourceType, ResourceEntry>}
     */
    static summarize(networkRecords: Array<LH.Artifacts.NetworkRequest>, URLArtifact: LH.Artifacts.URL, classifiedEntities: LH.Artifacts.EntityClassification): Record<ResourceType, ResourceEntry>;
    /**
     * @param {{URL: LH.Artifacts['URL'], devtoolsLog: LH.DevtoolsLog}} data
     * @param {LH.Artifacts.ComputedContext} context
     * @return {Promise<Record<ResourceType,ResourceEntry>>}
     */
    static compute_(data: {
        URL: LH.Artifacts['URL'];
        devtoolsLog: import("../index.js").DevtoolsLog;
    }, context: LH.Artifacts.ComputedContext): Promise<Record<ResourceType, ResourceEntry>>;
}
import { NetworkRequest } from '../lib/network-request.js';
import { EntityClassification } from './entity-classification.js';
//# sourceMappingURL=resource-summary.d.ts.map